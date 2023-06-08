import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { SelectItemGroup, MessageService } from "primeng/api";

@Component({
  selector: "app-add-item",
  templateUrl: "./add-item.component.html"
})
export class AddItemComponent implements OnInit, AfterViewInit{
  uploadedFiles: any[] = [];
  selectedCategory: string;
  groupedCategory: SelectItemGroup[];
  @ViewChild("form", { static: true }) form!: NgForm;

  constructor(private messageService: MessageService) {
    this.groupedCategory = [

    ]
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.controls["price"].addValidators([
        Validators.required,
        Validators.pattern("^([0-9])$")
      ]);
      this.form.controls["quantity"].addValidators([
        Validators.required,
        Validators.pattern("^([0-9])$")
      ]);
    })
  }
  ngOnInit(): void {}

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: "info",
      summary: "File Uploaded",
      detail: "",
    });
  }
  updateItem(): void {

  }
}
