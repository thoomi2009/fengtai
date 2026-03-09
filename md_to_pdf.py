#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert Markdown file to PDF document
"""

import re
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def parse_markdown_tables(md_content):
    """Pre-process markdown tables to HTML tables"""
    lines = md_content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Detect table
        if '|' in line and line.strip().startswith('|'):
            table_lines = []
            while i < len(lines) and '|' in lines[i]:
                table_lines.append(lines[i])
                i += 1

            # Convert table to HTML
            if table_lines:
                html_table = '<table class="md-table">'
                for idx, row_line in enumerate(table_lines):
                    if '---' in row_line:
                        continue
                    cells = [cell.strip() for cell in row_line.strip().strip('|').split('|')]
                    tag = 'th' if idx == 0 else 'td'
                    html_table += '<tr>'
                    for cell in cells:
                        html_table += f'<{tag}>{cell}</{tag}>'
                    html_table += '</tr>'
                html_table += '</table>'
                result.append(html_table)
            continue

        result.append(line)
        i += 1

    return '\n'.join(result)

def markdown_to_pdf(md_file, pdf_file):
    """Convert markdown file to PDF"""
    # Read markdown content
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Pre-process tables
    md_content = parse_markdown_tables(md_content)

    # Convert markdown to HTML
    html_body = markdown.markdown(
        md_content,
        extensions=[
            'tables',
            'fenced_code',
            'nl2br',
            'sane_lists',
            'toc'
        ]
    )

    # Create complete HTML document
    html_template = f'''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>丰台内外贸一体化服务平台 - 产品需求文档</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
            @bottom-center {{
                content: "第 " counter(page) " 页";
                font-size: 10pt;
                color: #666;
            }}
        }}

        body {{
            font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }}

        h1 {{
            font-size: 24pt;
            color: #0066CC;
            border-bottom: 3px solid #0066CC;
            padding-bottom: 10px;
            margin-top: 20px;
            margin-bottom: 15px;
            page-break-after: avoid;
        }}

        h2 {{
            font-size: 18pt;
            color: #0066CC;
            border-bottom: 2px solid #ddd;
            padding-bottom: 8px;
            margin-top: 18px;
            margin-bottom: 12px;
            page-break-after: avoid;
        }}

        h3 {{
            font-size: 14pt;
            color: #333;
            margin-top: 15px;
            margin-bottom: 10px;
            page-break-after: avoid;
        }}

        h4 {{
            font-size: 12pt;
            color: #333;
            margin-top: 12px;
            margin-bottom: 8px;
            page-break-after: avoid;
        }}

        h5, h6 {{
            font-size: 11pt;
            color: #333;
            margin-top: 10px;
            margin-bottom: 6px;
            page-break-after: avoid;
        }}

        p {{
            margin: 8px 0;
            text-align: justify;
        }}

        ul, ol {{
            margin: 8px 0;
            padding-left: 30px;
        }}

        li {{
            margin: 4px 0;
        }}

        table.md-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10pt;
            page-break-inside: avoid;
        }}

        table.md-table th {{
            background-color: #0066CC;
            color: white;
            font-weight: bold;
            padding: 8px;
            text-align: center;
            border: 1px solid #0055a5;
        }}

        table.md-table td {{
            padding: 6px 8px;
            border: 1px solid #ddd;
            text-align: left;
        }}

        table.md-table tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}

        code {{
            background-color: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: "Consolas", "Monaco", monospace;
            font-size: 10pt;
        }}

        pre {{
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            page-break-inside: avoid;
        }}

        pre code {{
            background-color: transparent;
            padding: 0;
        }}

        blockquote {{
            border-left: 4px solid #0066CC;
            margin: 10px 0;
            padding-left: 15px;
            color: #666;
        }}

        hr {{
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
        }}

        strong {{
            font-weight: bold;
            color: #333;
        }}

        a {{
            color: #0066CC;
            text-decoration: none;
        }}

        .header {{
            text-align: center;
            margin-bottom: 30px;
            page-break-after: avoid;
        }}

        .header h1 {{
            border: none;
            margin-bottom: 5px;
        }}

        .meta {{
            text-align: center;
            color: #666;
            font-size: 10pt;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>丰台内外贸一体化服务平台</h1>
        <h2>产品需求文档（PRD）</h2>
        <div class="meta">
            <p>文档版本：v1.1 | 创建日期：2026-03-07 | 更新日期：2026-03-08</p>
        </div>
    </div>
    {html_body}
</body>
</html>
    '''

    # Create font configuration
    font_config = FontConfiguration()

    # Generate PDF
    HTML(string=html_template).write_pdf(
        pdf_file,
        font_config=font_config,
        stylesheets=[CSS(string='''
            @font-face {
                font-family: "Microsoft YaHei";
                src: local("Microsoft YaHei"), local("微软雅黑");
            }
        ''', font_config=font_config)]
    )

    print(f"Successfully converted {md_file} to {pdf_file}")

if __name__ == '__main__':
    md_file = r'D:\ClaudeCode\fengtai\demand_full.md'
    pdf_file = r'D:\ClaudeCode\fengtai\demand_full.pdf'
    markdown_to_pdf(md_file, pdf_file)
