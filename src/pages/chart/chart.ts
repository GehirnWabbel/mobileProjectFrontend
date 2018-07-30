import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {colorDefinitions} from "../../app/colordefinitions";
import {Chart} from 'chart.js';
import {Storage} from "@ionic/storage";
import {ApiServiceProvider} from "../../providers/api-service/api-service";

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',

})
export class ChartPage {

  @ViewChild('totalStints') totalStintsCanvas;
  @ViewChild('totalTime') totalTimeCanvas;

  totalStintsChart: any;
  totalTimeChart: any;

  driverStatsFinished;
  driverStatsPlanned;

  teamId: string;
  eventId: string;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private api: ApiServiceProvider
  ) {
  }

  ionViewDidLoad() {
    this.storage.get("teamId").then(teamIdVal => {
      this.teamId = teamIdVal;
      this.storage.get("eventId").then(eventIdVal => {
        this.eventId = eventIdVal;
        this.loadData();
      })
    })
  }

  loadData() {
    this.api.getStatistics(this.eventId, this.teamId, true).then(finishedData => {
      this.driverStatsFinished = finishedData;
      this.api.getStatistics(this.eventId, this.teamId, false).then(plannedData => {
        this.driverStatsPlanned = plannedData;
        this.buildCharts();
      })
    })
  }

  refreshData(event) {
    this.loadData();
    event.complete();
  }


  buildCharts() {
    // put together the driver labels
    let driverNames = [];
    let colorsFinished = [];
    let colorsFinishedLightend = [];
    let colorsPlanned = [];
    let colorsPlannedLightend = [];
    let totalStintsFinished = [];
    let totalStintsPlanned = [];
    let totalTimeFinished = [];
    let totalTimePlanned = [];

    console.dir(this.driverStatsFinished);
    console.dir(this.driverStatsPlanned);

    let i = 0;
    for (let stats of this.driverStatsFinished) {
      console.dir(stats);
      colorsFinished[i] = colorDefinitions[stats['driver'].color];
      colorsFinishedLightend[i] = this.shadeColor2(colorsFinished[i], 0.2);
      driverNames[i] = stats['driver'].name;
      totalStintsFinished[i] = stats['totalStints'];
      totalTimeFinished[i] = stats['totalDrivingTime'];
      ++i;
    }

    let maxI = i;
    for (let stats of this.driverStatsPlanned) {
      console.dir(stats);
      i = driverNames.indexOf(stats['driver'].name);
      if(i < 0) //driver not found yet => so take the next avaliable i
        i = maxI++; //use post increase operator to save the index before increasing

      let driverColor = colorDefinitions[stats['driver'].color];
      colorsPlanned[i] = this.shadeColor2(driverColor, 0.4);
      colorsPlannedLightend[i] = this.shadeColor2(colorsPlanned[i], 0.2);
      driverNames[i] = stats['driver'].name;
      totalStintsPlanned[i] = stats['totalStints'];
      totalTimePlanned[i] = stats['totalDrivingTime'];
    }

    this.totalStintsChart = new Chart(this.totalStintsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: driverNames,
        datasets: [{
          label: 'Finished Stints',
          data: totalStintsFinished,
          backgroundColor: colorsFinishedLightend,
          borderColor: colorsFinished,
          borderWidth: 1
        },
          {
            label: 'Planned Stints',
            data: totalStintsPlanned,
            backgroundColor: colorsPlannedLightend,
            borderColor: colorsPlanned,
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    this.totalTimeChart = new Chart(this.totalTimeCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: driverNames,
        datasets: [{
          label: 'Finished Driving Time',
          data: totalTimeFinished,
          backgroundColor: colorsFinishedLightend,
          borderColor: colorsFinished,
          borderWidth: 1
        },
          {
            label: 'Planned Driving Time',
            data: totalTimePlanned,
            backgroundColor: colorsPlannedLightend,
            borderColor: colorsPlanned,
            borderWidth: 1
          }]
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  //Credits got to: SO User Pimp Trizkit => https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  shadeColor2(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
  }
}
