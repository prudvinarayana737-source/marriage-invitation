import tkinter as tk
from tkinter import filedialog
import shutil
import os

def main():
    root = tk.Tk()
    root.withdraw() # Hide the main window
    root.attributes('-topmost', True) # Bring to front

    # Force the window to be on top
    file_path = filedialog.askopenfilename(
        title="Select the Bride and Groom Photo for the Invitation",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.webp")]
    )

    if file_path:
        dest_dir = os.path.dirname(os.path.abspath(__file__))
        dest_file = os.path.join(dest_dir, 'couple.jpg')
        
        # We save it specifically as couple.jpg regardless of original extension
        # since HTML specifies couple.jpg
        shutil.copy(file_path, dest_file)
        print(f"Successfully copied {file_path} to {dest_file}")
    else:
        print("No file selected.")

if __name__ == "__main__":
    main()
