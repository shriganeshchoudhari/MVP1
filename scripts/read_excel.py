import pandas as pd
import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: python read_excel.py <path_to_excel> <output_md>")
        sys.exit(1)
        
    excel_path = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        xls = pd.ExcelFile(excel_path)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"Sheets found: {xls.sheet_names}\n\n")
            
            for sheet_name in xls.sheet_names:
                f.write(f"=== Sheet: {sheet_name} ===\n")
                df = pd.read_excel(xls, sheet_name=sheet_name)
                f.write(df.to_markdown(index=False))
                f.write("\n\n")
        print(f"Successfully wrote parsed excel to {output_path}")
            
    except Exception as e:
        print(f"Error reading Excel file: {e}")

if __name__ == "__main__":
    main()
