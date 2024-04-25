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
        const readCSV = (content, delimiter = ',') => {
            const columns = content.split('\n')[0].split(delimiter);
            return content.split('\n')
              .slice(1)
              .map(row => {
                const obj = {};
                const values = row.split(delimiter);
                columns.forEach((key, i) => {
                  obj[key] = values[i];
                });
                return obj;
              });
        };
        axios.get('assets/data/demo_data.csv')
        .then(r => {
            const data = readCSV(r.data).map(d => {
                const time = `${today} ${(new Date(parseFloat(d.ts))).toTimeString().split(" ")[0]}`;
                const sender = `${d['id.orig_h']}:${d['id.orig_p']}`;
                const receiver = `${d['id.resp_h']}:${d['id.resp_p']}`;
                const protocol = d.proto;
                const isMalicious = d.label == 'Malicious' ? 'Yes' : 'No';
                const detail = d['detailed-label'];
                return [time, sender, receiver, protocol, isMalicious, detail];
            });
            console.log(data[0][0])
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
