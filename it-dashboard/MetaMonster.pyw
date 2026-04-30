"""
MetaMonster - A GUI application to view and strip metadata from media
── Application Metadata ──────────────────────────────────
APP_NAME = "MetaMonster"
VERSION = "1.0"
CREATOR_NAME = "Austin Windorski"
PROF_NAME = "Prof. Frank Mora"
COURSE_NAME = "COP1034C - Python for IT"
ASSIGNMENT_NAME = "Python Final Project"
"""

import os
import sys
import traceback

# --- SAFE BOOTLOADER ---
# This catches missing modules and shows a popup instead of silently crashing
try:
    import shutil
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox
    import subprocess
    import json
    import threading
    from datetime import datetime
    
    # Third-party dependencies
    from PIL import Image
    from PIL.ExifTags import TAGS
    
    try:
        import static_ffmpeg
        static_ffmpeg.add_paths() 
    except ImportError:
        pass # GUI will handle this warning
        
except ImportError as e:
    import tkinter as tk
    from tkinter import messagebox
    root = tk.Tk()
    root.withdraw()
    missing_module = str(e).split("'")[1] if "'" in str(e) else str(e)
    msg = (
        f"MetaMonster cannot start because a required package is missing: {missing_module}\n\n"
        "Please open your Command Prompt or Terminal and run:\n"
        "pip install pillow static-ffmpeg"
    )
    messagebox.showerror("Missing Dependency", msg)
    sys.exit(1)
except Exception as e:
    import tkinter as tk
    from tkinter import messagebox
    root = tk.Tk()
    root.withdraw()
    messagebox.showerror("Fatal Error", f"MetaMonster crashed during startup:\n\n{traceback.format_exc()}")
    sys.exit(1)


# Windows-specific flag to hide the FFmpeg command prompt windows
CREATE_NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0


def get_executable_path(exe_name):
    """
    Dynamically locate an executable (ffmpeg or ffprobe).
    Checks PyInstaller temp folder, local directory, and system PATH.
    """
    if hasattr(sys, '_MEIPASS'):
        bundled_exe = os.path.join(sys._MEIPASS, exe_name)
        if os.path.exists(bundled_exe): 
            return bundled_exe
    
    local_exe = os.path.join(os.path.dirname(os.path.abspath(__file__)), exe_name)
    if os.path.exists(local_exe): 
        return local_exe
        
    system_exe = shutil.which(exe_name.replace('.exe', ''))
    if system_exe: 
        return system_exe
        
    return None

# --- Formatting Helpers ---

def format_size(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024: 
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{size:.2f} TB"

def format_bitrate(bps):
    try:
        bps = float(bps)
        if bps >= 1000000: 
            return f"{bps / 1000000:.2f} Mbps"
        elif bps >= 1000: 
            return f"{bps / 1000:.2f} kbps"
        return f"{int(bps)} bps"
    except: 
        return str(bps)

def format_fps(fps_str):
    try:
        if '/' in fps_str:
            num, den = fps_str.split('/')
            if float(den) == 0: 
                return fps_str
            fps = float(num) / float(den)
            formatted = f"{fps:.2f}".rstrip('0').rstrip('.') if fps % 1 == 0 else f"{fps:.2f}"
            return f"{formatted} fps"
        fps = float(fps_str)
        formatted = f"{fps:.2f}".rstrip('0').rstrip('.') if fps % 1 == 0 else f"{fps:.2f}"
        return f"{formatted} fps"
    except: 
        return str(fps_str)

def format_duration(seconds_str):
    try:
        sec = float(seconds_str)
        mins, s = divmod(sec, 60)
        hours, mins = divmod(mins, 60)
        if hours > 0: 
            return f"{int(hours):02d}:{int(mins):02d}:{int(s):02d}"
        return f"{int(mins):02d}:{int(s):02d}"
    except: 
        return str(seconds_str)

def format_timestamp(value):
    if isinstance(value, str) and 'T' in value:
        try: 
            return value.split('.')[0].replace('T', ' ')
        except: 
            pass
    return value


class ViewerTab(ttk.Frame):
    def __init__(self, parent, main_app):
        super().__init__(parent)
        self.main_app = main_app
        self.setup_ui()

    def setup_ui(self):
        file_frame = ttk.LabelFrame(self, text="Select File", padding="10")
        file_frame.pack(fill=tk.X, pady=5, padx=10)
        
        self.file_path_var = tk.StringVar()
        ttk.Entry(file_frame, textvariable=self.file_path_var, width=55).pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(file_frame, text="Browse", command=self.browse_file).pack(side=tk.LEFT, padx=5)
        
        self.file_info_label = tk.Label(self, text="Select a photo or video to view its metadata", font=("Arial", 10), foreground="blue")
        self.file_info_label.pack(pady=5)
        
        self.view_btn = ttk.Button(self, text="View Metadata", command=self.start_reading)
        self.view_btn.pack(pady=5)
        
        self.progress = ttk.Progressbar(self, mode='indeterminate', length=500)
        self.progress.pack(pady=5)
        
        metadata_frame = ttk.LabelFrame(self, text="Metadata", padding="10")
        metadata_frame.pack(fill=tk.BOTH, expand=True, pady=5, padx=10)
        
        scrollbar = ttk.Scrollbar(metadata_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.metadata_text = tk.Text(metadata_frame, wrap=tk.WORD, yscrollcommand=scrollbar.set, font=("Consolas", 10), height=12)
        self.metadata_text.pack(fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.metadata_text.yview)
        
        button_frame = ttk.Frame(self)
        button_frame.pack(fill=tk.X, pady=5, padx=10)
        
        ttk.Button(button_frame, text="Copy to Clipboard", command=self.copy_to_clipboard).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Clear", command=self.clear_metadata).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Export as JSON", command=self.export_json).pack(side=tk.LEFT, padx=5)
        
        self.status_label = tk.Label(self, text="Ready", font=("Arial", 10))
        self.status_label.pack(pady=5)
        
        if not self.main_app.ffprobe_available:
            tk.Label(self, text="⚠️ FFprobe not found. Video metadata reading disabled.\nRun 'pip install static-ffmpeg' in your terminal.", foreground="red", font=("Arial", 9)).pack()

    def browse_file(self):
        filename = filedialog.askopenfilename(
            title="Select a photo or video",
            filetypes=[("All supported", "*.jpg *.jpeg *.png *.gif *.bmp *.webp *.tiff *.mp4 *.avi *.mov *.mkv *.wmv"), ("All files", "*.*")]
        )
        if filename: 
            self.main_app.set_shared_file(filename)

    def update_ui_for_file(self, filepath):
        self.file_path_var.set(filepath)
        if not filepath:
            self.file_info_label.config(text="Select a photo or video to view its metadata")
            return
            
        ext = os.path.splitext(filepath)[1].lower()
        file_size = os.path.getsize(filepath)
        file_type = "Image" if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'] else "Video"
        self.file_info_label.config(text=f"Type: {file_type} | Extension: {ext} | Size: {format_size(file_size)}")

    def start_reading(self):
        input_path = self.file_path_var.get()
        if not input_path: 
            return messagebox.showwarning("Warning", "Please select a file first")
            
        self.progress.start(10)
        self.view_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Reading metadata...")
        threading.Thread(target=self.read_metadata, args=(input_path,)).start()

    def read_metadata(self, input_path):
        try:
            ext = os.path.splitext(input_path)[1].lower()
            metadata = {}
            stat = os.stat(input_path)
            
            metadata["File Info"] = {
                "Filename": os.path.basename(input_path),
                "File Size": format_size(stat.st_size),
                "Created": datetime.fromtimestamp(stat.st_ctime).strftime("%Y-%m-%d %H:%M:%S"),
                "Modified": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
            }
            
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']:
                metadata.update(self.read_image_metadata(input_path))
            elif ext in ['.mp4', '.avi', '.mov', '.mkv', '.wmv']:
                metadata.update(self.read_video_metadata(input_path))
            else:
                return self.main_app.root.after(0, self.show_error, "Unsupported file type")
                
            self.main_app.root.after(0, self.display_metadata, metadata)
        except Exception as e:
            self.main_app.root.after(0, self.show_error, str(e))

    def read_image_metadata(self, input_path):
        metadata = {}
        try:
            img = Image.open(input_path)
            metadata["Image Info"] = {
                "Format": img.format, "Mode": img.mode, 
                "Resolution": f"{img.width} x {img.height}",
            }
            if img.getexif():
                exif_info = {TAGS.get(tid, f"Unknown ({tid})"): (str(val) if not isinstance(val, bytes) else f"<{len(val)} bytes>") for tid, val in img.getexif().items()}
                if exif_info: 
                    metadata["EXIF Data"] = exif_info
        except Exception as e:
            metadata["Error"] = f"Could not read image metadata: {str(e)}"
        return metadata

    def read_video_metadata(self, input_path):
        metadata = {}
        if not self.main_app.ffprobe_available:
            metadata["Error"] = "FFprobe is not bundled or installed. Cannot read video metadata."
            return metadata
            
        try:
            cmd = [self.main_app.ffprobe_path, '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', input_path]
            # Use CREATE_NO_WINDOW so it doesn't pop up a console on Windows
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30, creationflags=CREATE_NO_WINDOW)
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                
                if 'format' in data:
                    fmt = data['format']
                    clean_tags = {k.replace('_', ' ').title(): format_timestamp(v) for k, v in fmt.get('tags', {}).items()}
                    metadata["Format Info"] = {
                        "Format": fmt.get('format_long_name', fmt.get('format_name', 'Unknown')),
                        "Duration": format_duration(fmt.get('duration', 0)),
                        "Overall Bitrate": format_bitrate(fmt.get('bit_rate', 0)),
                    }
                    if clean_tags: 
                        metadata["Format Tags"] = clean_tags

                for i, stream in enumerate(data.get('streams', [])):
                    codec_type = stream.get('codec_type', 'unknown').capitalize()
                    stream_key = f"{codec_type} Stream (Track {i+1})"
                    stream_data = {"Codec": stream.get('codec_long_name', stream.get('codec_name', 'Unknown'))}
                    
                    if codec_type == 'Video':
                        stream_data["Resolution"] = f"{stream.get('width', '?')}x{stream.get('height', '?')}"
                        stream_data["Frame Rate"] = format_fps(stream.get('r_frame_rate', ''))
                        stream_data["Bitrate"] = format_bitrate(stream.get('bit_rate', 0))
                    elif codec_type == 'Audio':
                        sample_rate = stream.get('sample_rate', 0)
                        stream_data["Sample Rate"] = f"{int(sample_rate)/1000} kHz" if sample_rate else "Unknown"
                        stream_data["Channels"] = stream.get('channels', 'Unknown')
                        stream_data["Bitrate"] = format_bitrate(stream.get('bit_rate', 0))

                    if stream.get('tags'):
                        stream_data["Tags"] = {k.replace('_', ' ').title(): format_timestamp(v) for k, v in stream['tags'].items()}
                        
                    metadata[stream_key] = stream_data
            else:
                metadata["Error"] = "Could not read video metadata with ffprobe"
        except Exception as e:
            metadata["Error"] = f"Error reading video metadata: {str(e)}"
        return metadata

    def display_metadata(self, metadata):
        self.progress.stop()
        self.view_btn.config(state=tk.NORMAL)
        self.status_label.config(text="Complete")
        self.metadata_text.delete(1.0, tk.END)
        
        output_lines = []
        for section, content in metadata.items():
            output_lines.append(f"=== {section} ===")
            if isinstance(content, dict):
                for k, v in content.items():
                    if isinstance(v, dict):
                        output_lines.append(f"  {k}:")
                        for sub_k, sub_v in v.items(): 
                            output_lines.append(f"    {sub_k}: {sub_v}")
                    else: 
                        output_lines.append(f"  {k}: {v}")
            else: 
                output_lines.append(f"  {content}")
            output_lines.append("")
            
        self.metadata_text.insert(1.0, "\n".join(output_lines))
        self.current_metadata = metadata

    def copy_to_clipboard(self):
        content = self.metadata_text.get(1.0, tk.END).strip()
        if content:
            self.main_app.root.clipboard_clear()
            self.main_app.root.clipboard_append(content)
            self.status_label.config(text="Copied to clipboard!")
            
    def clear_metadata(self):
        self.metadata_text.delete(1.0, tk.END)
        self.main_app.set_shared_file("")
        self.status_label.config(text="Ready")
        
    def export_json(self):
        if not hasattr(self, 'current_metadata'): 
            return
        filepath = filedialog.asksaveasfilename(title="Export JSON", defaultextension=".json", filetypes=[("JSON files", "*.json")])
        if filepath:
            with open(filepath, 'w', encoding='utf-8') as f: 
                json.dump(self.current_metadata, f, indent=2, ensure_ascii=False, default=str)
            messagebox.showinfo("Success", f"Exported to:\n{filepath}")

    def show_error(self, error_message):
        self.progress.stop()
        self.view_btn.config(state=tk.NORMAL)
        self.status_label.config(text="Error")
        messagebox.showerror("Error", f"Failed to read metadata:\n\n{error_message}")


class StripperTab(ttk.Frame):
    def __init__(self, parent, main_app):
        super().__init__(parent)
        self.main_app = main_app
        self.setup_ui()

    def setup_ui(self):
        file_frame = ttk.LabelFrame(self, text="Select File", padding="10")
        file_frame.pack(fill=tk.X, pady=5, padx=10)
        
        self.file_path_var = tk.StringVar()
        ttk.Entry(file_frame, textvariable=self.file_path_var, width=50).pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(file_frame, text="Browse", command=self.browse_file).pack(side=tk.LEFT, padx=5)
        
        self.file_info_label = tk.Label(self, text="Select a photo or video to strip", font=("Arial", 10), foreground="blue")
        self.file_info_label.pack(pady=5)
        
        output_frame = ttk.LabelFrame(self, text="Output Location", padding="10")
        output_frame.pack(fill=tk.X, pady=5, padx=10)
        
        self.output_path_var = tk.StringVar()
        ttk.Entry(output_frame, textvariable=self.output_path_var, width=50).pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        ttk.Button(output_frame, text="Choose...", command=self.choose_output).pack(side=tk.LEFT, padx=5)
        
        options_frame = ttk.LabelFrame(self, text="Options", padding="10")
        options_frame.pack(fill=tk.X, pady=5, padx=10)
        self.keep_extension_var = tk.BooleanVar(value=True)
        ttk.Checkbutton(options_frame, text="Auto-append '_clean' to filename", variable=self.keep_extension_var, command=self.auto_update_output).pack(anchor=tk.W)
        
        self.progress = ttk.Progressbar(self, mode='determinate', length=400)
        self.progress.pack(pady=10)
        
        self.process_btn = tk.Button(self, text="⚡ Strip Metadata", command=self.start_processing, font=("Arial", 14, "bold"), bg="#D8BFD8", relief=tk.RAISED, borderwidth=4, cursor="hand2")
        self.process_btn.pack(pady=10)
        
        self.status_label = tk.Label(self, text="Ready", font=("Arial", 10))
        self.status_label.pack(pady=5)
        
        if not self.main_app.ffmpeg_available:
            tk.Label(self, text="⚠️ FFmpeg not found. Video stripping disabled.\nRun 'pip install static-ffmpeg' in your terminal.", foreground="red", font=("Arial", 9)).pack()

    def browse_file(self):
        filename = filedialog.askopenfilename(
            title="Select a photo or video",
            filetypes=[("All supported", "*.jpg *.jpeg *.png *.gif *.bmp *.webp *.tiff *.mp4 *.avi *.mov *.mkv *.wmv"), ("All files", "*.*")]
        )
        if filename: 
            self.main_app.set_shared_file(filename)

    def update_ui_for_file(self, filepath):
        self.file_path_var.set(filepath)
        if filepath:
            ext = os.path.splitext(filepath)[1].lower()
            file_size = os.path.getsize(filepath)
            file_type = "Image" if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'] else "Video"
            self.file_info_label.config(text=f"Type: {file_type} | Size: {format_size(file_size)}")
            self.auto_update_output()
        else:
            self.file_info_label.config(text="Select a photo or video to strip")
            self.output_path_var.set("")

    def auto_update_output(self):
        filepath = self.file_path_var.get()
        if filepath and self.keep_extension_var.get():
            base, ext = os.path.splitext(filepath)
            self.output_path_var.set(f"{base}_clean{ext}")

    def choose_output(self):
        input_path = self.file_path_var.get()
        if not input_path: 
            return
        ext = os.path.splitext(input_path)[1]
        output_path = filedialog.asksaveasfilename(title="Save stripped file as", defaultextension=ext, filetypes=[(f"{ext[1:].upper()} files", f"*{ext}")])
        if output_path: 
            self.output_path_var.set(output_path)

    def start_processing(self):
        in_path, out_path = self.file_path_var.get(), self.output_path_var.get()
        if not in_path or not out_path: 
            return messagebox.showwarning("Warning", "Check input/output paths")
        if in_path == out_path: 
            return messagebox.showwarning("Warning", "Output cannot overwrite input")
            
        self.progress.config(mode='determinate', value=0)
        self.process_btn.config(state=tk.DISABLED, bg="#C0A0C0")
        self.status_label.config(text="⏳ Processing...")
        threading.Thread(target=self.process_file, args=(in_path, out_path)).start()

    def process_file(self, input_path, output_path):
        try:
            ext = os.path.splitext(input_path)[1].lower()
            self.main_app.root.after(0, lambda: self.progress.config(value=20))
            
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']:
                self.strip_image(input_path, output_path)
            elif ext in ['.mp4', '.avi', '.mov', '.mkv', '.wmv']:
                self.strip_video(input_path, output_path)
            else:
                return self.main_app.root.after(0, self.show_error, "Unsupported file type")
                
            self.main_app.root.after(0, lambda: self.progress.config(value=100))
            self.main_app.root.after(0, self.show_success, output_path)
        except Exception as e:
            self.main_app.root.after(0, self.show_error, str(e))

    def strip_image(self, input_path, output_path):
        with Image.open(input_path) as img:
            data = list(img.getdata())
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            clean_img.save(output_path, optimize=True)

    def strip_video(self, input_path, output_path):
        if not self.main_app.ffmpeg_available: 
            raise Exception("FFmpeg missing.")
        
        cmd = [self.main_app.ffmpeg_path, '-i', input_path, '-c', 'copy', '-map_metadata', '-1', '-y', output_path]
        res = subprocess.run(cmd, capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
        
        if res.returncode != 0:
            cmd = [self.main_app.ffmpeg_path, '-i', input_path, '-c:v', 'libx264', '-c:a', 'aac', '-map_metadata', '-1', '-y', output_path]
            res = subprocess.run(cmd, capture_output=True, text=True, creationflags=CREATE_NO_WINDOW)
            if res.returncode != 0: 
                raise Exception(res.stderr)

    def show_success(self, output_path):
        self.process_btn.config(state=tk.NORMAL, bg="#D8BFD8")
        self.status_label.config(text="✓ Complete!")
        messagebox.showinfo("Success", f"Metadata stripped!\nSaved to: {output_path}")

    def show_error(self, err):
        self.progress['value'] = 0
        self.process_btn.config(state=tk.NORMAL, bg="#D8BFD8")
        self.status_label.config(text="✗ Error")
        messagebox.showerror("Error", f"Failed:\n{err}")


class MetaMonsterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("MetaMonster")
        self.root.geometry("750x700")
        self.root.resizable(True, True)
        
        self.ffmpeg_path = get_executable_path('ffmpeg.exe')
        self.ffprobe_path = get_executable_path('ffprobe.exe')
        self.ffmpeg_available = self.ffmpeg_path is not None
        self.ffprobe_available = self.ffprobe_path is not None

        tk.Label(self.root, text="🛡️ MetaMonster", font=("Arial", 22, "bold"), fg="#2d1a4a").pack(pady=10)

        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        
        self.viewer_tab = ViewerTab(self.notebook, self)
        self.stripper_tab = StripperTab(self.notebook, self)
        
        self.notebook.add(self.viewer_tab, text=" 🔍 Viewer ")
        self.notebook.add(self.stripper_tab, text=" ⚡ Stripper ")

    def set_shared_file(self, filepath):
        self.viewer_tab.update_ui_for_file(filepath)
        self.stripper_tab.update_ui_for_file(filepath)


def main():
    root = tk.Tk()
    style = ttk.Style()
    if 'clam' in style.theme_names(): 
        style.theme_use('clam')
    app = MetaMonsterApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()