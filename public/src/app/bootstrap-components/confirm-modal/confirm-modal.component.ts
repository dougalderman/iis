import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})

export class ConfirmModalComponent implements OnInit {
  @Input() title: string;
  @Input() action: string;
  @Input() name: string;
  @Input() additionalInformation: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
