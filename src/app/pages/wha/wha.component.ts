import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-wha',
  templateUrl: './wha.component.html',
  styleUrls: ['./wha.component.scss']
})
export class WhaComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // UI State
  showEditor = false;
  showControlPanel = false;
  imageUrl = '';
  currentImage: HTMLImageElement | null = null;

  // Text Properties
  fontSize = 48;
  fontColor = '#ffffff';
  shadowEnabled = false;
  shadowColor = '#000000';
  fontFamily = 'Arial Black';
  textOffsetX = 0;
  textOffsetY = 0;

  textSelection = 'Workhard Anywhere';
  customText = '';

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.loadImageFromFile(file);
    }
  }

  onUrlInput(): void {
    if (this.imageUrl) {
      this.loadImageFromURL(this.imageUrl);
    }
  }

  private loadImageFromFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        this.currentImage = image;
        this.showEditorView();
        setTimeout(() => {
          this.drawImageWithText();
          this.autoSetComplementaryColor();
        }, 600);
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private loadImageFromURL(url: string): void {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      this.currentImage = image;
      this.showEditorView();
      setTimeout(() => {
        this.drawImageWithText();
        this.autoSetComplementaryColor();
      }, 600);
    };
    image.onerror = () => alert("Bild konnte nicht geladen werden.");
    image.src = url;
  }

  private showEditorView(): void {
    this.showEditor = true;
    setTimeout(() => {
      this.showControlPanel = true;
    }, 800);
  }

  backToInitialScreen(): void {
    this.showControlPanel = false;
    setTimeout(() => {
      this.showEditor = false;
      this.currentImage = null;
    }, 300);
  }

  toggleControlPanel(): void {
    this.showControlPanel = !this.showControlPanel;
  }

  updateCanvas(): void {
    if (this.currentImage) {
      this.drawImageWithText();
    }
  }

  private drawImageWithText(): void {
    if (!this.currentImage || !this.canvas || !this.ctx) return;

    this.canvas.width = this.currentImage.naturalWidth;
    this.canvas.height = this.currentImage.naturalHeight;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.currentImage, 0, 0);

    this.ctx.font = `${this.fontSize}px "${this.fontFamily}"`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.fontColor;

    if (this.shadowEnabled) {
      this.ctx.shadowColor = this.shadowColor;
      this.ctx.shadowBlur = 5;
    } else {
      this.ctx.shadowColor = 'transparent';      this.ctx.shadowBlur = 0;    }    let lines: string[] = [];    switch (this.textSelection) {      case 'Workhard Anywhere':        lines = ["Workhard", "Anywhere"];        break;      case 'Never Settle':        lines = ["Never", "Settle"];        break;      case 'Work Hard Play Hard':        lines = ["Work Hard", "Play Hard"];        break;      case 'Custom':        lines = this.customText.split('\n');        break;    }    const startY = this.canvas.height / 3 - (this.fontSize / 2);    lines.forEach((line, i) => {      const y = startY + i * this.fontSize * 1.2 + this.textOffsetY;      this.ctx.fillText(line, this.canvas.width / 2 + this.textOffsetX, y);    });
  }

  private autoSetComplementaryColor(): void {
    if (!this.currentImage) return;

    const avgColor = this.getAverageColor(this.currentImage);
    const compColor = this.getComplementaryColor(avgColor);
    this.fontColor = this.rgbToHex(compColor.r, compColor.g, compColor.b);
    this.drawImageWithText();
  }

  private getAverageColor(image: HTMLImageElement): {r: number, g: number, b: number} {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    tempCtx.drawImage(image, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    return { r, g, b };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  private getComplementaryColor({ r, g, b }: {r: number, g: number, b: number}): {r: number, g: number, b: number} {
    return { r: 255 - r, g: 255 - g, b: 255 - b };
  }

  downloadImage(): void {
    if (!this.currentImage) {
      alert("Kein Bild geladen.");
      return;
    }
    this.drawImageWithText();
    const link = document.createElement('a');
    link.download = 'wallpaper-creator.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}