import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Bid } from 'src/app/models/Bid';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})



export class AuctionComponent implements OnInit, OnDestroy {
  auction: Auction;
  bids: Bid[];
  strikePrice: number;
  connection;
  bidSimTimer;
  currentUser: User;

  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute, private authService: AuthenticationService) {
    this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      // this.bids = this.auction.bids;
      this.bids = this.auction.bids.sort(function(a,b){
        return a.pps - b.pps; //to reverse b.date-a.date
     });

    });
  }

  ngOnInit() {
    console.log('initializIng parent comp');
    this.connection = this.auctionService.getBids(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = auction.currentStrikePrice;
      this.bids = auction.bids.sort(function(a,b){
      return a.pps - b.pps; //to reverse b.date-a.date
   });
    });
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }
      console.log("Got New Bids AKA Initializing Connection to socket - GetBids");
  }

  ngOnDestroy() {
    console.log("Unsubbing - Auction Component");
    this.connection.unsubscribe();
  }

  resetBids(id: string) {
    console.log("Resetting Bids");
    this.auctionService.resetBids(this.auction._id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      this.bids = this.auction.bids;
    });
  }

  simulateBids(id: string){
    console.log('Simulating Bids');

    const me = this;
    var precision = 100; // 2 decimals
    let i = 0;

    while(i <120){
      let randomNumShares = Math.floor(Math.random() * 100) + 25;
    let randomPPS = Math.floor(Math.random() * (20 * precision - 1 * precision) + 1 * precision) / (1*precision) + 6;
      // randomNumShares = Math.floor(Math.random() * (20 * precision - 1 * precision) + 1 * precision) / (1 * precision);
      setTimeout(() => {
        this.auctionService.placeBid(this.auction._id, this.currentUser._id, randomPPS, randomNumShares);
      }, 700*(i + 1));
      i++;
    }
  }
}
