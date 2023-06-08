import { HttpHeaders } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AccordionTab } from "primeng/accordion";
import { FileUpload } from "primeng/fileupload";
import { AuthService } from "src/app/global/auth.service";
import { FileUploadService } from "src/app/global/file-upload.service";
import { File, FileClient } from "../../ngswag/client";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-image-attachment",
  templateUrl: "./image-attachment.component.html",
  styleUrls: ["./image-attachment.component.scss"],
})
export class ImageAttachmentComponent implements OnInit {
  @Input() height = "90px";
  @Input() width = "90px";
  @Input() url?: string;
  imageStyle: any;
  dialogOpened = false;
  @Input() uploadUrl: string;
  @ViewChild("fileUpload", { static: false }) fileUpload: FileUpload;
  @ViewChild("imageSelectionTab", { static: false })
  imageSelectionTab: AccordionTab;
  headers: HttpHeaders;
  @Input() method: "POST" | "PUT" = "POST";
  imageSrc: any;
  timeStamp?: number;
  fileUploaded = false;
  images: File[] = [];
  selectedImage?: File;
  @Output() selectedImageHandler = new EventEmitter<File>();
  @Input() editable = false;
  @Input() isRound = true;
  @Input() deletable = false;
  @Output() deleteImageHandler = new EventEmitter();

  constructor(
    private $auth: AuthService,
    private $fileUpload: FileUploadService,
    private $fileClient: FileClient,
    private $cdRef: ChangeDetectorRef,
    private $confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.imageStyle = {
      height: this.height,
      width: this.width,
    };

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.$auth.getJwtToken()}`,
    });

    this.loadImage();
  }

  private loadImage() {
    if (this.url) {
      this.$fileClient.load(this.url).subscribe((res) => {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.imageSrc = reader.result;
          },
          false
        );

        if (res) {
          reader.readAsDataURL(res.data);
        }
      });
    }
  }

  openDialog(): void {
    if (this.editable) this.dialogOpened = true;
  }

  onUpload() {
    this.fileUploaded = true;
  }

  onOked() {
    if (!this.imageSelectionTab.selected) {
      this.dialogOpened = false;
      location.reload();
      return;
    }

    if (!this.selectedImage) return;

    this.selectedImageHandler.emit(this.selectedImage);
  }

  upload(event: any) {
    const file = event.files[0];
    this.$fileUpload.upload(file, this.uploadUrl, this.method).subscribe({
      next: (event) => {
        this.fileUpload.onProgress.emit(event);
        if (event.type === 1 && event.loaded === event.total) {
          this.fileUpload.onUpload.emit(file);
        }
      },
    });
  }

  progressReport($event: any) {
    if ($event.type === 0) {
      this.fileUpload.progress = 0;
      return;
    }

    this.fileUpload.progress = ($event.loaded / $event.total) * 100;
  }

  getSrc(image: File) {
    if (!image.filePath) return;

    this.$fileClient.load(image.filePath).subscribe((res) => {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          (<any>image).src = reader.result;
        },
        false
      );

      if (res) {
        reader.readAsDataURL(res.data);
      }
    });
  }

  selectImage(image: File) {
    this.selectedImage = image;
    this.fileUploaded = true;
  }

  onAccordionTabChange(event: any) {
    if (event.index === 1 && !this.images.length) {
      this.$fileClient.getAll().subscribe((files) => {
        this.images = files;
        this.images.map((image) => {
          this.getSrc(image);
        });
      });
    }

    this.fileUploaded = false;
  }

  deleteImage() {
    this.$confirmation.confirm({
      message: "Do you want to delete this image?",
      accept: () => this.deleteImageHandler.emit(),
    });
  }
}
