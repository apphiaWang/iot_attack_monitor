import { Component } from '@angular/core';
import { ToastrService } from "ngx-toastr";


@Component({
    selector: 'logs-cmp',
    moduleId: module.id,
    templateUrl: 'logs.component.html'
})

export class LogsComponent{
  public iotRequests;
  constructor(private toastr: ToastrService) {}
  convertTime(timestamp) {
    const time = new Date(timestamp*1000);
    return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}\
     ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  }
  generateAlertFromLog(log) {
    return `${log.label} ${log.proto} request recceived at ${this.convertTime(log.ts)}\n`
      + `contains ${log.orig_pkts} packets, ${log.orig_ip_bytes} bytes`;
  }
  ngOnInit(){
    const responseData = [{
      "id.orig_h": "192.168.100.103",
      "id.orig_p": "55124",
      "id.resp_h": "65.127.233.163",
      "id.resp_p": "23",
      "ts": 1525879831,
      "orig_pkts": 1,
      "orig_ip_bytes": 60,
      "proto": "tcp",
      "service": "http",
      "label": "Malicious"
  },
  {
      "id.orig_h": "192.168.100.103",
      "id.orig_p": "56305",
      "id.resp_h": "63.150.16.171",
      "id.resp_p": "23",
      "ts": 1525898831,
      "orig_pkts": 3,
      "orig_ip_bytes": 180,
      "proto": "tcp",
      "service": "http",
      "label": "Benign"
  }];
    this.iotRequests = responseData.map(l => ({label: l.label, text: this.generateAlertFromLog(l)})) 
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
