import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { Auction, AuctionStatus } from 'src/app/core/models/auctions';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuctionService } from 'src/app/core/services/auction.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss'],
})
export class AuctionsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  auctions: Auction[] = [];
  selectedAuctions: Auction[] = [];
  auction: Auction = {} as Auction;

  showAddEditDialog = false;
  currentAuctionId?: number;

  deleteAuctionDialog: boolean = false;
  deleteAuctionsDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  statuses = [
    { label: 'Pendiente', value: 0 },
    { label: 'Activa', value: 1 },
    { label: 'Completada', value: 2 },
    { label: 'Cancelada', value: 3 }
  ];

  constructor(
    private auctionService: AuctionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.loading = true;
    this.auctionService.getAuctions()
    .subscribe({
      next: (auctions) => {
        this.auctions = auctions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: any): any {
    switch(status) {
      case "0": return 'Pendiente';
      case "1": return 'Activa';
      case "2": return 'Completada';
      case "3": return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  getStatusSeverity(status: any): any {
    switch(status) {
      case "0": return 'warning';
      case "1": return 'success';
      case "2": return 'info';
      case "3": return 'danger';
      default: return '';
    }
  }

  deleteAuction(auction: Auction): void {
    this.auction = { ...auction };
    this.deleteAuctionDialog = true;
  }

  confirmDelete(): void {
    this.deleteAuctionDialog = false;
    this.auctionService.deleteAuction(this.auction.id).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Subasta eliminada exitosamente');
        this.loadAuctions();
        this.auction = {} as Auction;
      },
    });
  }

  confirmDeleteSelected(): void {
    this.deleteAuctionsDialog = false;
    if (!this.selectedAuctions || this.selectedAuctions.length === 0) {
      this.notificationService.showErrorCustom('No hay subastas seleccionadas');
      return;
    }

    const deleteOperations = this.selectedAuctions.map(auction => 
      this.auctionService.deleteAuction(auction.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom(`${this.selectedAuctions.length} subastas eliminadas`);
        this.loadAuctions();
        this.selectedAuctions = [];
      }
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentAuctionId = undefined;
    this.showAddEditDialog = true;
  }

  editAuction(auction: Auction): void {
    this.auction = { ...auction };
    this.currentAuctionId = auction.id;
    this.showAddEditDialog = true;
  }

  onAuctionSaved(): void {
    this.showAddEditDialog = false;
    this.loadAuctions();
  }
}