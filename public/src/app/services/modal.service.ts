import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from '../components/bootstrap-components/confirm-modal/confirm-modal.component';


@Injectable()
export class ModalService {

  constructor(
    private ngbModalService: NgbModal
  ) {}

  open(type: string, title: string, action: string, name: string, additionalInformation: string): NgbModalRef {
    let modalRef: NgbModalRef;

    if (type === 'confirm') { // Confirm modal
      modalRef = this.ngbModalService.open(ConfirmModalComponent);
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.action = action;
      modalRef.componentInstance.name = name;
      modalRef.componentInstance.additionalInformation = additionalInformation;
    }
    return modalRef;
  }
}
