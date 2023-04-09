import { Component } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import axios from 'axios';

@Component({
    selector: 'logs-cmp',
    moduleId: module.id,
    templateUrl: 'logs.component.html'
})

export class LogsComponent{
  public iotRequests = [];
  protected simulateDate = '12/21/2018';
  protected observable;
  constructor(private toastr: ToastrService) {
    this.observable = new Observable(function subscribe(subscriber) {
      const id = setInterval(() => {
        subscriber.next('hi');
      }, 15000);
    });
  }
  removeNotification(i) {
    this.iotRequests.splice(i, 1);
  }
  convertTime(timestamp) {
    const time = new Date(timestamp*1000);
    return `${(new Date()).toLocaleDateString("en-US")} ${time.toTimeString().split(" ")[0]}`;
  }
  generateAlertFromLog(log) {
    return `${log.label} ${log.proto} request recceived at ${this.convertTime(log.ts)}\n`
      + `contains ${log.orig_pkts} packets, ${log.orig_ip_bytes} bytes`;
  }
  updateRequests() {
    axios.post('https://nxwabxe738.execute-api.us-west-2.amazonaws.com/dev',
            {ts1: this.getSimulateTimestamp(30), ts2:this.getSimulateTimestamp()})
        .then(r => {
            const newRequests = JSON.parse(r.data.body)
                .map(l => ({label: l.label, text: this.generateAlertFromLog(l)}))
            newRequests.forEach(r => {
              this.iotRequests.push(r)
            });                     
        });
  }
  ngOnInit(){
    this.updateRequests();
    this.observable.subscribe(() => this.updateRequests()); 
  }
  getSimulateTimestamp(timeDiff=0) {
    const today = (new Date()).toLocaleDateString("en-US");
    const diff = (Date.parse(today) - Date.parse(this.simulateDate));
    const targetDate = (Date.now() - diff)/1000 - timeDiff;
    return targetDate;
  }
  showNotification(from, align) {
    const color = Math.floor(Math.random() * 5 + 1);

    switch (color) {
      case 1:
        this.toastr.info(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-info alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 3:
        this.toastr.warning(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-warning alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 4:
        this.toastr.error(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>',
          "",
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      case 5:
        this.toastr.show(
        '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Welcome to <b>Paper Dashboard Angular</b> - a beautiful bootstrap dashboard for every web developer.</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-primary alert-with-icon",
            positionClass: "toast-" + from + "-" + align
          }
        );
        break;
      default:
        break;
    }
  }
}
