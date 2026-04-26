// Service Book PDF export.
//
// Uses jsPDF + jspdf-autotable. Runs entirely client-side — the user's
// service data never leaves their browser. Branded subtly with
// h-dbuilds.com so a shared PDF also markets the site.

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { bikes as bikeCatalog } from './bikes.js'
import { intervals, findLastMatchingEntry, evaluateInterval } from './serviceIntervals.js'
import { MOD_CATEGORY_GROUPS, CATEGORY_TO_GROUP } from './modCategories.js'

const HD_ORANGE = [244, 122, 38]     // #F47A26
const DARK_TEXT = [26, 26, 26]
const MUTED = [110, 110, 110]

function fmtDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  } catch {
    return iso
  }
}

function fmtMiles(n) {
  return (Number(n) || 0).toLocaleString() + ' mi'
}

function fmtMoney(n) {
  if (n == null || n === '') return ''
  return '$' + Number(n).toFixed(2)
}

export function exportServiceBookPDF({ bike, log }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginX = 48

  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)
  const bikeName =
    bike.nickname ||
    (bike.year && bike.model ? `${bike.year} ${bike.model}` : bike.model) ||
    'Bike'

  // --- Header bar ---
  doc.setFillColor(...HD_ORANGE)
  doc.rect(0, 0, pageW, 6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_TEXT)
  doc.setFontSize(20)
  doc.text('SERVICE BOOK', marginX, 46)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  doc.text('sidestand.app', pageW - marginX, 46, { align: 'right' })

  // --- Bike info card ---
  let y = 76
  doc.setDrawColor(220)
  doc.setLineWidth(0.5)
  doc.rect(marginX, y, pageW - marginX * 2, 96)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_TEXT)
  doc.setFontSize(16)
  doc.text(bikeName, marginX + 14, y + 24)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  const subLine = [
    bike.year,
    bike.model,
    preset ? `— ${preset.label}` : null
  ]
    .filter(Boolean)
    .join(' · ')
  if (subLine) doc.text(subLine, marginX + 14, y + 40)

  // Two-column detail grid inside the card
  const col1X = marginX + 14
  const col2X = marginX + 260
  const detailsY = y + 58
  const row = (label, value, x, yy) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), x, yy)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK_TEXT)
    doc.text(String(value || '—'), x, yy + 13)
  }
  row('Current mileage', fmtMiles(bike.mileage), col1X, detailsY)
  row('VIN', bike.vin || '—', col2X, detailsY)
  row('Purchase date', fmtDate(bike.purchaseDate) || '—', col1X, detailsY + 30)
  row('Report generated', fmtDate(new Date().toISOString()), col2X, detailsY + 30)

  // --- Service history table ---
  let tableY = y + 96 + 28

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...DARK_TEXT)
  doc.text('Service History', marginX, tableY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(
    log.length + ' entr' + (log.length === 1 ? 'y' : 'ies'),
    pageW - marginX,
    tableY,
    { align: 'right' }
  )

  const rows = log.map((e) => [
    fmtDate(e.date),
    fmtMiles(e.mileage),
    e.title || 'Service',
    [e.parts, e.notes].filter(Boolean).join(' — '),
    fmtMoney(e.cost)
  ])

  if (rows.length === 0) {
    rows.push(['—', '—', 'No service entries logged yet.', '', ''])
  }

  autoTable(doc, {
    startY: tableY + 8,
    head: [['Date', 'Mileage', 'Service', 'Parts / Notes', 'Cost']],
    body: rows,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: DARK_TEXT,
      lineColor: [230, 230, 230],
      lineWidth: 0.25,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: MUTED,
      fontStyle: 'bold',
      fontSize: 8,
      lineWidth: 0
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252]
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 60 },
      2: { cellWidth: 140, fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 55, halign: 'right' }
    },
    didDrawPage: () => drawFooter(doc, pageW, pageH, marginX)
  })

  // --- HD intervals summary (optional, fits on last page if space) ---
  const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || tableY + 40
  if (finalY + 220 < pageH - 60) {
    drawIntervalSummary(doc, { bike, log, startY: finalY + 28, marginX, pageW })
  } else {
    doc.addPage()
    drawIntervalSummary(doc, { bike, log, startY: 60, marginX, pageW })
    drawFooter(doc, pageW, pageH, marginX)
  }

  // Filename
  const slug = (bikeName || 'bike').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  const stamp = new Date().toISOString().slice(0, 10)
  doc.save(`service-book_${slug}_${stamp}.pdf`)
}

function drawIntervalSummary(doc, { bike, log, startY, marginX, pageW }) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...DARK_TEXT)
  doc.text('HD Recommended Intervals (reference)', marginX, startY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text(
    'Harley-Davidson intervals shown as a soft reference only.',
    marginX,
    startY + 12
  )

  const rows = intervals.map((i) => {
    const last = findLastMatchingEntry(i, log)
    const ev = evaluateInterval(i, bike.mileage || 0, last)
    let statusText = ''
    if (ev.status === 'overdue') statusText = `Overdue +${ev.milesOver.toLocaleString()} mi`
    else if (ev.status === 'due-soon') statusText = `Due in ${ev.milesLeft.toLocaleString()} mi`
    else if (ev.status === 'ok') statusText = `Next at ${ev.dueAt.toLocaleString()} mi`
    else statusText = 'Done (one-time)'
    return [
      i.label,
      last ? `${(last.mileage || 0).toLocaleString()} mi · ${fmtDate(last.date)}` : '—',
      statusText
    ]
  })

  autoTable(doc, {
    startY: startY + 20,
    head: [['Item', 'Last logged', 'Status']],
    body: rows,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: DARK_TEXT,
      lineColor: [230, 230, 230],
      lineWidth: 0.25
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: MUTED,
      fontStyle: 'bold',
      fontSize: 8,
      lineWidth: 0
    },
    columnStyles: {
      0: { cellWidth: 180, fontStyle: 'bold' },
      1: { cellWidth: 150 },
      2: { cellWidth: 'auto' }
    }
  })
}

// =====================================================================
// Bike Report PDF export — full picture of a bike: specs, build/mods,
// service history, totals. Meant for sharing with buyers/mechanics or
// archiving a build. Pulls from the same sources as the Service Book
// but puts the build summary front-and-center.
// =====================================================================

export function exportBikeReportPDF({ bike, log, mods }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginX = 48

  const preset = bikeCatalog.find((p) => p.id === bike.bikeTypeId)
  const bikeName =
    bike.nickname ||
    (bike.year && bike.model ? `${bike.year} ${bike.model}` : bike.model) ||
    'Bike'

  // ---- Cover / header ----
  doc.setFillColor(...HD_ORANGE)
  doc.rect(0, 0, pageW, 6, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_TEXT)
  doc.setFontSize(22)
  doc.text('BIKE REPORT', marginX, 46)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  doc.text('sidestand.app', pageW - marginX, 46, { align: 'right' })

  // ---- Bike identity card ----
  let y = 76
  doc.setDrawColor(220)
  doc.setLineWidth(0.5)
  doc.rect(marginX, y, pageW - marginX * 2, 118)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_TEXT)
  doc.setFontSize(18)
  doc.text(bikeName, marginX + 14, y + 26)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...MUTED)
  const subLine = [
    bike.year,
    bike.model,
    preset ? `— ${preset.label}` : null
  ]
    .filter(Boolean)
    .join(' · ')
  if (subLine) doc.text(subLine, marginX + 14, y + 42)

  const col1X = marginX + 14
  const col2X = marginX + 260
  const detailsY = y + 62
  const row = (label, value, x, yy) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), x, yy)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...DARK_TEXT)
    doc.text(String(value || '—'), x, yy + 13)
  }
  row('Current mileage', fmtMiles(bike.mileage), col1X, detailsY)
  row('VIN', bike.vin || '—', col2X, detailsY)
  row('Purchase date', fmtDate(bike.purchaseDate) || '—', col1X, detailsY + 30)
  row('Report generated', fmtDate(new Date().toISOString()), col2X, detailsY + 30)

  // ---- Build totals summary ----
  const installedMods = mods.filter((m) => m.status === 'installed')
  const plannedMods = mods.filter((m) => m.status === 'planned')
  const installedCost = installedMods.reduce(
    (s, m) => s + (Number(m.cost) || 0),
    0
  )
  const serviceCost = log.reduce((s, e) => s + (Number(e.cost) || 0), 0)

  let summaryY = y + 118 + 24
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...DARK_TEXT)
  doc.text('Ownership Summary', marginX, summaryY)

  const summaryRows = [
    ['Mods installed', `${installedMods.length}`],
    ['Mods planned', `${plannedMods.length}`],
    ['Service entries', `${log.length}`],
    ['Installed mods total', fmtMoney(installedCost)],
    ['Service history total', fmtMoney(serviceCost)],
    [
      'Combined spend',
      fmtMoney(installedCost + serviceCost)
    ]
  ]

  autoTable(doc, {
    startY: summaryY + 8,
    body: summaryRows,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: DARK_TEXT,
      lineColor: [230, 230, 230],
      lineWidth: 0.25
    },
    columnStyles: {
      0: { cellWidth: 180, textColor: MUTED, fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right' }
    },
    didDrawPage: () => drawFooter(doc, pageW, pageH, marginX)
  })

  // ---- Build / Mods section ----
  doc.addPage()
  drawSectionHeader(doc, 'Build / Mods', marginX)

  if (mods.length === 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...MUTED)
    doc.text('No mods logged on this bike yet.', marginX, 92)
  } else {
    const grouped = groupModsForPdf(mods)
    let sectionY = 90
    for (const { group, items } of grouped) {
      // Group heading
      if (sectionY > pageH - 120) {
        doc.addPage()
        drawFooter(doc, pageW, pageH, marginX)
        sectionY = 60
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...HD_ORANGE)
      doc.text(group.toUpperCase(), marginX, sectionY)
      sectionY += 6

      const rows = items.map((m) => [
        m.title || m.category || 'Mod',
        m.brand || '—',
        m.partNumber || '—',
        m.status,
        m.installDate ? fmtDate(m.installDate) : '—',
        m.installMileage != null ? fmtMiles(m.installMileage) : '—',
        fmtMoney(m.cost)
      ])

      autoTable(doc, {
        startY: sectionY + 4,
        head: [
          ['Mod', 'Brand', 'Part #', 'Status', 'Installed', 'Mileage', 'Cost']
        ],
        body: rows,
        margin: { left: marginX, right: marginX },
        styles: {
          fontSize: 8.5,
          cellPadding: 5,
          textColor: DARK_TEXT,
          lineColor: [230, 230, 230],
          lineWidth: 0.25,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: MUTED,
          fontStyle: 'bold',
          fontSize: 7.5,
          lineWidth: 0
        },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        columnStyles: {
          0: { cellWidth: 140, fontStyle: 'bold' },
          1: { cellWidth: 70 },
          2: { cellWidth: 65 },
          3: { cellWidth: 55 },
          4: { cellWidth: 60 },
          5: { cellWidth: 55 },
          6: { cellWidth: 'auto', halign: 'right' }
        },
        didDrawPage: () => drawFooter(doc, pageW, pageH, marginX)
      })

      sectionY =
        (doc.lastAutoTable && doc.lastAutoTable.finalY) || sectionY + 60
      sectionY += 16
    }
  }

  // ---- Service history ----
  doc.addPage()
  drawSectionHeader(doc, 'Service History', marginX)

  const serviceRows = log.map((e) => [
    fmtDate(e.date),
    fmtMiles(e.mileage),
    e.title || 'Service',
    [e.parts, e.notes].filter(Boolean).join(' — '),
    fmtMoney(e.cost)
  ])
  if (serviceRows.length === 0) {
    serviceRows.push(['—', '—', 'No service entries logged yet.', '', ''])
  }

  autoTable(doc, {
    startY: 90,
    head: [['Date', 'Mileage', 'Service', 'Parts / Notes', 'Cost']],
    body: serviceRows,
    margin: { left: marginX, right: marginX },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: DARK_TEXT,
      lineColor: [230, 230, 230],
      lineWidth: 0.25,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: MUTED,
      fontStyle: 'bold',
      fontSize: 8,
      lineWidth: 0
    },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 60 },
      2: { cellWidth: 140, fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 55, halign: 'right' }
    },
    didDrawPage: () => drawFooter(doc, pageW, pageH, marginX)
  })

  // Filename
  const slug = (bikeName || 'bike').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  const stamp = new Date().toISOString().slice(0, 10)
  doc.save(`bike-report_${slug}_${stamp}.pdf`)
}

function drawSectionHeader(doc, title, marginX) {
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_TEXT)
  doc.setFontSize(16)
  doc.text(title, marginX, 60)
  doc.setDrawColor(...HD_ORANGE)
  doc.setLineWidth(1.5)
  doc.line(marginX, 68, marginX + 40, 68)
}

// Sort mods into the same group order as the UI (MOD_CATEGORY_GROUPS).
// Unknown categories fall into 'Other'.
function groupModsForPdf(mods) {
  const byGroup = new Map()
  for (const m of mods) {
    const g = CATEGORY_TO_GROUP[m.category] || 'Other'
    if (!byGroup.has(g)) byGroup.set(g, [])
    byGroup.get(g).push(m)
  }
  const order = MOD_CATEGORY_GROUPS.map((g) => g.group)
  return order
    .filter((g) => byGroup.has(g))
    .map((g) => ({ group: g, items: byGroup.get(g) }))
}

function drawFooter(doc, pageW, pageH, marginX) {
  const y = pageH - 28
  doc.setDrawColor(235)
  doc.setLineWidth(0.5)
  doc.line(marginX, y - 10, pageW - marginX, y - 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('Sidestand · sidestand.app', marginX, y)

  const page = doc.internal.getCurrentPageInfo().pageNumber
  const total = doc.internal.getNumberOfPages()
  doc.text(`Page ${page} of ${total}`, pageW - marginX, y, { align: 'right' })

  doc.setFontSize(7)
  doc.text(
    'Not affiliated with Harley-Davidson. Verify torque values and part numbers against the printed service manual.',
    pageW / 2,
    y + 11,
    { align: 'center' }
  )
}
