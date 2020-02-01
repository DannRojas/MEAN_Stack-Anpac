import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor() { }

  @Output()
  confirmDel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('confirmDelete')
  modalConfirmDelete: {
    show: () => void,
    hide: () => void;
  };

  public message: string;
  public object: string;

  ngOnInit() {
  }

  onPreConfirmDelete(message?: string, object?: string){
    this.message = message;
    this.object = object;
    this.modalConfirmDelete.show();
  }

  confirm(){
    this.confirmDel.emit(true);
    this.modalConfirmDelete.hide();
  }

  noConfirm(){
    this.confirmDel.emit(false);
    this.modalConfirmDelete.hide();
  }


}
