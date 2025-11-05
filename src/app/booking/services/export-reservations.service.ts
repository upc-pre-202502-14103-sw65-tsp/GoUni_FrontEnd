import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportReservationsService {
  exportToExcel(reservations: any[]): void {
    let worksheet;
    if (!reservations || reservations.length === 0) {
      worksheet = XLSX.utils.aoa_to_sheet([['No tienes reservas por el momento']]);
    } else {
      const data = reservations.map(r => ({
        Conductor: `${r.driver?.firstName || ''} ${r.driver?.lastName || ''}`,
        Destino: r.destination?.name || '',
        Fecha: r.date ? new Date(r.date).toLocaleDateString() : '',
        Hora: r.time || '',
        Estado: r.status || '',
        Precio: r.price || ''
      }));
      worksheet = XLSX.utils.json_to_sheet(data);
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'reservas_gouni.xlsx');
  }
}