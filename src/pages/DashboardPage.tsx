import { Pie } from '@ant-design/charts'
import { Card, Statistic, Typography } from 'antd'

import { useAppSelector } from '../store/hooks'
import { selectDashboardStats } from '../store/selectors'

export const DashboardPage = () => {
  const stats = useAppSelector(selectDashboardStats)

  const capacityPieData = [
    { type: 'Đã đăng ký', value: stats.enrollmentsCount },
    { type: 'Còn trống', value: stats.remainingCapacity },
  ]

  const capacityPieConfig = {
    data: capacityPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    height: 260,
    label: {
      text: (d: { type: string; value: number }) => `${d.type}: ${d.value}`,
      position: 'spider' as const,
    },
    legend: {
      color: { position: 'bottom' as const },
    },
    tooltip: {
      title: (d: { type: string }) => d.type,
      items: [
        (d: { type: string; value: number }) => ({
          name: d.type,
          value: `${d.value} chỗ`,
        }),
      ],
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: `${stats.enrollmentsCount}/${stats.totalCapacity}`,
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 'bold' as const,
        },
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Card className="shadow-sm" style={{ flex: 1, minWidth: 0 }}>
          <Statistic title="Tổng học viên" value={stats.studentsCount} />
        </Card>
        <Card className="shadow-sm" style={{ flex: 1, minWidth: 0 }}>
          <Statistic title="Khoá đang mở" value={stats.openCoursesCount} />
        </Card>
        <Card className="shadow-sm" style={{ flex: 1, minWidth: 0 }}>
          <Statistic title="Tổng lượt đăng ký" value={stats.enrollmentsCount} />
        </Card>
        <Card className="shadow-sm" style={{ flex: 1, minWidth: 0 }}>
          <Statistic
            title="Mức đầy chung"
            value={Math.round(stats.fillRate * 100)}
            suffix="%"
          />
        </Card>
      </div>

      <Card className="shadow-sm">
        <Typography.Title level={5} className="m-0! mb-3">
          Tỉ lệ lấp đầy (đăng ký / sức chứa)
        </Typography.Title>
        <Pie {...capacityPieConfig} />
      </Card>
    </div>
  )
}
