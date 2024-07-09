import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
  } from '@angular/core';
  import {
    BarcodeFormat,
    BarcodeScanner,
    LensFacing,
    StartScanOptions,
  } from '@capacitor-mlkit/barcode-scanning';
  import { InputCustomEvent } from '@ionic/angular';
  import {
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonIcon,
    IonRange,
    ModalController,
  } from '@ionic/angular/standalone';
  @Component({
    selector: 'app-barcode-scanning',
    template: `
      <ion-header>
        <ion-toolbar>
          <ion-title>Scanning</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="closeModal()">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div #square class="square"></div>
      </ion-content>
    `,
    styles: [
      `
        ion-content {
          --background: transparent;
        }
  
        .square {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 16px;
          width: 200px;
          height: 200px;
          border: 6px solid white;
          box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
        }
      `,
    ],
    standalone: true,
    imports: [IonHeader, IonToolbar, IonContent, IonButton, IonInput, IonRange, IonButton, IonIcon, IonTitle, IonButtons],
  })
  export class BarcodeScanningModalComponent
    implements OnInit, AfterViewInit, OnDestroy
  {
    @Input()
    public formats: BarcodeFormat[] = [];
    @Input()
    public lensFacing: LensFacing = LensFacing.Back;
    @ViewChild('square')
    public squareElement: ElementRef<HTMLDivElement> | undefined;
  
    public barCode: string | undefined;
  
    @Output() public barcodeScanned = new EventEmitter<string>();
  
    public isTorchAvailable = false;
  
    constructor(
      private readonly ngZone: NgZone,
      private modalCtrl: ModalController,
    ) {}
  
    public ngOnInit(): void {
      BarcodeScanner.isTorchAvailable().then((result) => {
        this.isTorchAvailable = result.available;
      });
    }
  
    public ngAfterViewInit(): void {
      setTimeout(() => {
        this.startScan();
      }, 500);
    }
  
    public ngOnDestroy(): void {
      this.stopScan();
    }
  
    public async closeModal(): Promise<void> {
      this.modalCtrl.dismiss({
        'barCode': this.barCode
      });
    }
  
    public async toggleTorch(): Promise<void> {
      await BarcodeScanner.toggleTorch();
    }
  
    private async startScan(): Promise<void> {
      // Hide everything behind the modal (see `src/theme/variables.scss`)
      document.querySelector('body')?.classList.add('barcode-scanning-active');
  
      const options: StartScanOptions = {
        formats: this.formats,
        lensFacing: this.lensFacing,
      };
  
      const squareElementBoundingClientRect =
        this.squareElement?.nativeElement.getBoundingClientRect();
      const scaledRect = squareElementBoundingClientRect
        ? {
            left: squareElementBoundingClientRect.left * window.devicePixelRatio,
            right:
              squareElementBoundingClientRect.right * window.devicePixelRatio,
            top: squareElementBoundingClientRect.top * window.devicePixelRatio,
            bottom:
              squareElementBoundingClientRect.bottom * window.devicePixelRatio,
            width:
              squareElementBoundingClientRect.width * window.devicePixelRatio,
            height:
              squareElementBoundingClientRect.height * window.devicePixelRatio,
          }
        : undefined;
      const detectionCornerPoints = scaledRect
        ? [
            [scaledRect.left, scaledRect.top],
            [scaledRect.left + scaledRect.width, scaledRect.top],
            [
              scaledRect.left + scaledRect.width,
              scaledRect.top + scaledRect.height,
            ],
            [scaledRect.left, scaledRect.top + scaledRect.height],
          ]
        : undefined;
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async (event) => {
          this.ngZone.run(() => {
            const cornerPoints = event.barcode.cornerPoints;
            if (detectionCornerPoints && cornerPoints) {
              if (
                detectionCornerPoints[0][0] > cornerPoints[0][0] ||
                detectionCornerPoints[0][1] > cornerPoints[0][1] ||
                detectionCornerPoints[1][0] < cornerPoints[1][0] ||
                detectionCornerPoints[1][1] > cornerPoints[1][1] ||
                detectionCornerPoints[2][0] < cornerPoints[2][0] ||
                detectionCornerPoints[2][1] < cornerPoints[2][1] ||
                detectionCornerPoints[3][0] > cornerPoints[3][0] ||
                detectionCornerPoints[3][1] < cornerPoints[3][1]
              ) {
                return;
              }
            }
            this.barCode = event.barcode.rawValue;
            listener.remove();
            this.closeModal();
          });
        },
      );
      await BarcodeScanner.startScan(options);
    }
  
    private async stopScan(): Promise<void> {
      // Show everything behind the modal again
      document.querySelector('body')?.classList.remove('barcode-scanning-active');
  
      await BarcodeScanner.stopScan();
    }
  }
  