import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportReservationsService {
  
  exportToExcel(reservations: any[]): void {
    if (!reservations || reservations.length === 0) {
      // Crear archivo con mensaje de no reservas
      const worksheet = XLSX.utils.aoa_to_sheet([
        ['No tienes reservas por el momento'],
        [''],
        ['Fecha de exportación:', new Date().toLocaleDateString('es-PE')]
      ]);
      
      // Ajustar el ancho de las columnas
      worksheet['!cols'] = [{ width: 30 }];
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveExcelFile(excelBuffer, 'reservas_gouni.xlsx');
      return;
    }

    // Preparar datos para exportación
    const data = reservations.map((reservation, index) => ({
      '#': index + 1,
      'Conductor': `${reservation.driver?.firstName || 'N/A'} ${reservation.driver?.lastName || ''}`.trim(),
      'Destino': reservation.destination?.name || 'N/A',
      'Fecha': reservation.date ? new Date(reservation.date).toLocaleDateString('es-PE') : 'N/A',
      'Hora': reservation.time || 'N/A',
      'Estado': this.translateStatus(reservation.status || 'pending'),
      'Precio (S/.)': reservation.price || 0,
      'Fecha de Creación': reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString('es-PE') : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajustar anchos de columnas
    worksheet['!cols'] = [
      { width: 5 },  // #
      { width: 20 }, // Conductor
      { width: 25 }, // Destino
      { width: 12 }, // Fecha
      { width: 8 },  // Hora
      { width: 12 }, // Estado
      { width: 12 }, // Precio
      { width: 15 }  // Fecha Creación
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mis Reservas');
    
    // Agregar hoja de resumen
    this.addSummarySheet(workbook, reservations);
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, `reservas_gouni_${new Date().getTime()}.xlsx`);
  }

  private addSummarySheet(workbook: XLSX.WorkBook, reservations: any[]): void {
    const totalReservations = reservations.length;
    const totalAmount = reservations.reduce((sum, r) => sum + (r.price || 0), 0);
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    
    const summaryData = [
      ['Resumen de Reservas'],
      [''],
      ['Total de Reservas:', totalReservations],
      ['Reservas Confirmadas:', confirmedReservations],
      ['Monto Total:', `S/. ${totalAmount.toFixed(2)}`],
      [''],
      ['Fecha de exportación:', new Date().toLocaleDateString('es-PE')],
      ['Hora de exportación:', new Date().toLocaleTimeString('es-PE')]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    try {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error saving Excel file:', error);
      throw new Error('No se pudo guardar el archivo Excel');
    }
  }

  private translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return statusMap[status] || status;
  }
}