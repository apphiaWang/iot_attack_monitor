import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import axios from 'axios';
import * as $ from 'jquery';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{

  protected simulateDate = '12/21/2018';
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public deviceNum = 0;
  public maliciousRequest = 0;
  public timerSubscription;
  public lastUpdateTime;
  public logs;
  public isLoading = true;
    ngOnInit(){
      
      window.alert(`The request flow and machine learning prediction have been turned off due to cloud service charge. The current UI is showing static data for demo purpose.`);
      this.deviceNum = 20;
      this.lastUpdateTime = new Date().toLocaleString("en-US");

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
      }
      axios.get('assets/data/demo_data.csv')
          .then(response => {            
            this.logs = readCSV(response.data);
            this.logs.forEach(log => {
              log.date = new Date(log.ts * 1000);
              log.hour = log.date.getHours();
            });
            // console.log(this.logs[0])
            this.drawLineChart();
            this.isLoading=false;
          });

      /* fetch data from AWS deployed endpoint
      axios.post('https://nxwabxe738.execute-api.us-west-2.amazonaws.com/dev',
        {ts1: Date.parse(this.simulateDate)/1000, ts2:this.getSimulateTimestamp()})
      .then(r => {
        this.logs = JSON.parse(r.data.body);
        this.logs.forEach(log => {
          log.date = new Date(log.ts * 1000);
          log.hour = log.date.getHours();
        });
        this.drawLineChart();
        this.isLoading=false;
      });
      */
    }
    drawLineChart() {
      const speedCanvas = document.getElementById("lineChart");
      const maxHour = 24;
      const benignData = new Array(maxHour+1).fill(0);
      const maliciousData = new Array(maxHour+1).fill(0);
      this.logs.filter(log => log.label == "Benign") 
              .reduce((acc, log) => {
                acc[log.hour] += 1;
                return acc;
              }, benignData);
      this.logs.filter(log => log.label != "Benign") 
              .reduce((acc, log) => {
                acc[log.hour] += 1;
                return acc;
              }, maliciousData);
      const dataFirst = {
        data: maliciousData,
        fill: false,
        borderColor: '#FF5733',
        backgroundColor: 'transparent',
        pointBorderColor: '#FF5733',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      const dataSecond = {
        data: benignData,
        fill: false,
        borderColor: '#51bcda',
        backgroundColor: 'transparent',
        pointBorderColor: '#51bcda',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };
      this.maliciousRequest = dataFirst.data.reduce((partialSum, a) => partialSum + a, 0);
      const speedData = {
        labels: [...Array(maxHour+1).keys()],
        datasets: [dataFirst, dataSecond]
      };

      const chartOptions = {
        legend: {
          display: false,
          position: 'top'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of Requests'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Hour of Day'
            }
          }]
        }     
      };
      
      const lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });
    }
    getSimulateTimestamp() {
      const today = (new Date()).toLocaleDateString("en-US");
      const diff = (Date.parse(today) - Date.parse(this.simulateDate));
      const targetDate = (Date.now() - diff)/1000;
      return targetDate;
    }
    ngOnDestroy(): void { 
      // this.timerSubscription.unsubscribe(); 
    } 
}
