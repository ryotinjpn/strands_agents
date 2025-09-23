"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Activity, BarChart3, DollarSign, Users, MessageSquare, X } from "lucide-react"
import Chat from "./Chat"
import { Button } from "./ui/button"

const salesData = [
  { name: "Jan", sales: 4000, profit: 2400, revenue: 2400 },
  { name: "Feb", sales: 3000, profit: 1398, revenue: 2210 },
  { name: "Mar", sales: 2000, profit: 9800, revenue: 2290 },
  { name: "Apr", sales: 2780, profit: 3908, revenue: 2000 },
  { name: "May", sales: 1890, profit: 4800, revenue: 2181 },
  { name: "Jun", sales: 2390, profit: 3800, revenue: 2500 },
  { name: "Jul", sales: 3490, profit: 4300, revenue: 2100 },
]

const categoryData = [
  { name: "Desktop", value: 400, color: "#0088FE" },
  { name: "Mobile", value: 300, color: "#00C49F" },
  { name: "Tablet", value: 200, color: "#FFBB28" },
  { name: "Other", value: 100, color: "#FF8042" },
]

const trafficData = [
  { time: "00:00", users: 20 },
  { time: "03:00", users: 15 },
  { time: "06:00", users: 25 },
  { time: "09:00", users: 45 },
  { time: "12:00", users: 65 },
  { time: "15:00", users: 55 },
  { time: "18:00", users: 40 },
  { time: "21:00", users: 30 },
]

const StatCard = ({ title, value, change, icon: Icon }: {
  title: string
  value: string
  change: string
  icon: React.ElementType
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Main Dashboard Content */}
      <div className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isChatOpen ? (
              <>
                <X className="h-4 w-4" />
                Close Chat
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Open Chat
              </>
            )}
          </Button>
        </div>
      
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
          />
          <StatCard
            title="Subscriptions"
            value="+2350"
            change="+180.1% from last month"
            icon={Users}
          />
          <StatCard
            title="Sales"
            value="+12,234"
            change="+19% from last month"
            icon={BarChart3}
          />
          <StatCard
            title="Active Now"
            value="+573"
            change="+201 since last hour"
            icon={Activity}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {label}
                              </span>
                              <span className="font-bold text-muted-foreground">
                                Sales: ${payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="sales" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
                { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
              ].map((sale, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Line Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Daily active users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {label}
                              </span>
                              <span className="font-bold">
                                Users: {payload[0].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  strokeWidth={2} 
                  className="stroke-primary" 
                  dot={{ className: "fill-primary" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Device Categories</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Profit</CardTitle>
          <CardDescription>Monthly revenue and profit comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {label}
                            </span>
                            {payload.map((entry, index) => (
                              <span key={index} className="font-bold" style={{ color: entry.color }}>
                                {entry.name}: ${entry.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Chat Assistant</h3>
            <Button
              onClick={() => setIsChatOpen(false)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}