import { Component, OnInit } from '@angular/core';
import DataTable from 'datatables.net-dt';
import axios from 'axios';


@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit{
    public isLoading = true;
    protected simulateDate = '12/21/2018';
    ngOnInit(){
        const today = (new Date()).toLocaleDateString("en-US");
        axios.post('https://nxwabxe738.execute-api.us-west-2.amazonaws.com/dev',
            {ts1: Date.parse(this.simulateDate)/1000, ts2:this.getSimulateTimestamp()})
        .then(r => {
            const data = JSON.parse(r.data.body).map(d => {
                const time = `${today} ${(new Date(d.ts)).toTimeString().split(" ")[0]}`;
                const sender = `${d['id.orig_h']}:${d['id.orig_p']}`;
                const receiver = `${d['id.resp_h']}:${d['id.resp_p']}`;
                const protocol = d.proto;
                const isMalicious = d.label == 'Malicious' ? 'Yes' : 'No';
                const detail = d['detailed-label'];
                return [time, sender, receiver, protocol, isMalicious, detail];
            });
            const columns = ['time', 'sender', 'receiver', 'protocol', 'isMalicious', 'detail'];
            let table = new DataTable('#myTable', {
                data,
                columns: columns.map(title => ({title})),
            });
            this.isLoading = false;
        });
    }
    getSimulateTimestamp() {
        const today = (new Date()).toLocaleDateString("en-US");
        const diff = (Date.parse(today) - Date.parse(this.simulateDate));
        const targetDate = (Date.now() - diff)/1000;
        return targetDate;
      }
}
