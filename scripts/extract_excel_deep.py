"""
Deep extraction script for RM Journey BBG.xlsx
- Extracts all sheets with row/column data
- Lists all sheet names
- Extracts embedded images (if any)
- Outputs a clean analysis to docs/RM_Journey_BBG_analysis.md
"""

import sys
import os
import json
import openpyxl
from openpyxl_image_loader import SheetImageLoader
from collections import defaultdict

EXCEL_PATH = sys.argv[1] if len(sys.argv) > 1 else r"f:\MVP1\docs\RM Journey BBG.xlsx"
OUTPUT_MD   = sys.argv[2] if len(sys.argv) > 2 else r"f:\MVP1\docs\RM_Journey_BBG_analysis.md"
IMG_DIR     = r"f:\MVP1\docs\excel_images"

os.makedirs(IMG_DIR, exist_ok=True)

wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)

lines = []
lines.append("# RM Journey BBG – Deep Sheet Analysis\n")
lines.append(f"**Source:** `{EXCEL_PATH}`\n")
lines.append(f"**Total sheets:** {len(wb.sheetnames)}\n")
lines.append(f"**Sheet names:** {', '.join(wb.sheetnames)}\n\n")
lines.append("---\n")

img_index = []

for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    lines.append(f"\n## Sheet: {sheet_name}\n")
    lines.append(f"> Dimensions: {ws.dimensions}  |  Max row: {ws.max_row}  |  Max col: {ws.max_column}\n\n")

    # ── Try extracting embedded images ──
    try:
        image_loader = SheetImageLoader(ws)
        saved_imgs = []
        for row in ws.iter_rows():
            for cell in row:
                try:
                    if image_loader.image_in(cell.coordinate):
                        img = image_loader.get(cell.coordinate)
                        fname = f"{sheet_name.replace(' ','_')}_{cell.coordinate}.png"
                        fpath = os.path.join(IMG_DIR, fname)
                        img.save(fpath)
                        saved_imgs.append((cell.coordinate, fpath))
                        img_index.append({"sheet": sheet_name, "cell": cell.coordinate, "path": fpath})
                except Exception:
                    pass
        if saved_imgs:
            lines.append("### Embedded Images\n")
            for coord, path in saved_imgs:
                lines.append(f"- Cell `{coord}` → `{path}`\n")
            lines.append("\n")
    except Exception as e:
        lines.append(f"> *(Image extraction not available for this sheet: {e})*\n\n")

    # ── Extract all non-empty cell values row by row ──
    lines.append("### Step-by-Step Content\n\n")
    rows_data = []
    for row in ws.iter_rows(values_only=True):
        # collect non-None cells
        cells = [(i+1, v) for i, v in enumerate(row) if v is not None]
        if cells:
            rows_data.append((row, cells))

    if not rows_data:
        lines.append("*(No text content in this sheet)*\n")
        continue

    # Group into a clean numbered list for readability
    step_num = 0
    for row, cells in rows_data:
        primary = str(cells[0][1]).strip()
        extra   = [f"Col {c}: `{v}`" for c, v in cells[1:] if str(v).strip().lower() not in ('nan','none','')]
        if not primary or primary.lower() in ('nan', 'none'):
            continue
        step_num += 1
        note = "  (" + " | ".join(extra) + ")" if extra else ""
        lines.append(f"{step_num}. {primary}{note}\n")

    lines.append("\n")

lines.append("\n---\n## Image Index (all sheets)\n\n")
if img_index:
    for item in img_index:
        lines.append(f"- **{item['sheet']}** – Cell `{item['cell']}` → `{item['path']}`\n")
else:
    lines.append("No embedded images found.\n")

with open(OUTPUT_MD, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"✅ Analysis saved to: {OUTPUT_MD}")
print(f"✅ Images saved to:   {IMG_DIR}")
print(f"  Total sheets processed: {len(wb.sheetnames)}")
print(f"  Total images extracted: {len(img_index)}")
