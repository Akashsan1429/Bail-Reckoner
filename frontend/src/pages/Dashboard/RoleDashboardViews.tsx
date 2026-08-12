import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseDto, UserDto } from '../../types/api'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { CitationChip } from '../../components/ui/CitationChip'
import { DisclaimerStrip } from '../../components/ui/DisclaimerStrip'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  PlusCircle,
  Bot,
  BookOpen,
  Upload,
  Calendar,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  Briefcase,
  Scale,
  Users,
  Award,
  Database,
  Building2,
  Lock,
  FolderKanban,
} from 'lucide-react'

interface RoleViewProps {
  user: UserDto | null
  cases: CaseDto[]
  onOpenChat: () => void
}

// Chart Data Mocking
const caseTrendData = [
  { name: 'May 12', all: 11, eligible: 7, pending: 3 },
  { name: 'May 13', all: 15, eligible: 9, pending: 5 },
  { name: 'May 14', all: 13, eligible: 8, pending: 3 },
  { name: 'May 15', all: 16, eligible: 9, pending: 4 },
  { name: 'May 16', all: 14, eligible: 8, pending: 3 },
  { name: 'May 17', all: 18, eligible: 12, pending: 6 },
  { name: 'May 18', all: 17, eligible: 11, pending: 5 },
]

const pieData = [
  { name: 'Eligible', value: 5, color: '#403D88' },
  { name: 'Pending', value: 4, color: '#8B639B' },
  { name: 'Not Eligible', value: 2, color: '#AF719D' },
  { name: 'Under Review', value: 1, color: '#F8B2B2' },
]

/* =========================================================================
   1. PRISONER FAMILY DASHBOARD VIEW (Matching user reference layout exactly)
   ========================================================================= */
export const FamilyDashboardView: React.FC<RoleViewProps> = ({ user, cases, onOpenChat }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36] flex items-center gap-2">
            Good Morning, {user?.name?.split(' ')[0] || 'Rahul'} 🖐️
          </h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            Here's what's happening with your cases today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F8F7FC] border border-[#EBE5F5] text-xs font-semibold text-[#403D88] flex items-center gap-2 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#8B639B]" />
            <span>May 12 - May 18, 2025</span>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm flex items-center justify-between hover:border-[#8B639B]/30 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6B6888]">Total Cases</p>
            <h3 className="text-2xl font-extrabold text-[#1F1D36]">{cases.length || 12}</h3>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 18% <span className="text-[#9B98B4]">from last month</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F8B2B2]/20 flex items-center justify-center text-[#AF719D]">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm flex items-center justify-between hover:border-[#8B639B]/30 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6B6888]">Eligible Cases</p>
            <h3 className="text-2xl font-extrabold text-[#403D88]">{cases.filter(c => c.status === 'EVALUATED').length || 5}</h3>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 25% <span className="text-[#9B98B4]">from last month</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#8B639B]/15 flex items-center justify-center text-[#403D88]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm flex items-center justify-between hover:border-[#8B639B]/30 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6B6888]">Pending Cases</p>
            <h3 className="text-2xl font-extrabold text-[#8B639B]">{cases.filter(c => c.status === 'DRAFT').length || 4}</h3>
            <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ↓ 8% <span className="text-[#9B98B4]">from last month</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#AF719D]/15 flex items-center justify-center text-[#8B639B]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm flex items-center justify-between hover:border-[#8B639B]/30 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#6B6888]">Reports Generated</p>
            <h3 className="text-2xl font-extrabold text-[#AF719D]">8</h3>
            <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> ↑ 30% <span className="text-[#9B98B4]">from last month</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#403D88]/10 flex items-center justify-center text-[#AF719D]">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Charts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Case Overview Line Chart & Case Status Donut */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case Overview Line Area Chart (2/3 width) */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1F1D36]">Case Overview</h2>
                  <p className="text-xs text-[#6B6888]">Weekly undertrial eligibility trends</p>
                </div>
                <span className="text-xs font-semibold text-[#403D88] bg-[#F8F7FC] px-3 py-1 rounded-xl border border-[#EBE5F5]">
                  This Week
                </span>
              </div>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caseTrendData}>
                    <defs>
                      <linearGradient id="colorAll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#AF719D" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#AF719D" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorEligible" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#403D88" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#403D88" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#9B98B4" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9B98B4" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#EBE5F5', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="all" stroke="#AF719D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAll)" name="All Cases" />
                    <Area type="monotone" dataKey="eligible" stroke="#403D88" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEligible)" name="Eligible" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Case Status Pie Chart (1/3 width) */}
            <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1F1D36]">Case Status</h2>
                <p className="text-xs text-[#6B6888]">Distribution breakdown</p>
              </div>

              <div className="h-40 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-[#1F1D36] block">12</span>
                  <span className="text-[10px] text-[#6B6888] font-medium">Total Cases</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#EBE5F5]">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#6B6888]">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-[#1F1D36]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Cases Table & Eligibility Radial Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Cases Table (2/3 width) */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1F1D36]">Recent Cases</h2>
                <button
                  onClick={() => navigate('/cases')}
                  className="text-xs font-semibold text-[#403D88] hover:text-[#312E6B] transition-colors"
                >
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EBE5F5] text-[#9B98B4] font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Case ID</th>
                      <th className="pb-3">Offence</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8F7FC]">
                    {(cases.length > 0
                      ? cases.slice(0, 4)
                      : [
                          { id: '1', caseNumber: 'Case #BR-2025-0012', offenceSection: 'IPC 420, 467', status: 'EVALUATED' as const, createdAt: 'May 18, 2025', createdById: '1', createdByName: 'System', firstTimeOffender: true, residentialStability: true, employmentStatus: 'EMPLOYED', dependents: 1, previousCourtAppearances: 0, previousAbsconding: false, witnessTampering: false, coAccused: false, evidenceType: 'DOCUMENTARY', caseStage: 'INVESTIGATION', suretyAvailable: true, bondReady: true, identificationReady: true, updatedAt: 'May 18, 2025' },
                          { id: '2', caseNumber: 'Case #BR-2025-0011', offenceSection: 'IPC 379', status: 'DRAFT' as const, createdAt: 'May 17, 2025', createdById: '1', createdByName: 'System', firstTimeOffender: true, residentialStability: true, employmentStatus: 'EMPLOYED', dependents: 1, previousCourtAppearances: 0, previousAbsconding: false, witnessTampering: false, coAccused: false, evidenceType: 'DOCUMENTARY', caseStage: 'INVESTIGATION', suretyAvailable: true, bondReady: true, identificationReady: true, updatedAt: 'May 17, 2025' },
                          { id: '3', caseNumber: 'Case #BR-2025-0010', offenceSection: 'NDPS Act 20(b)', status: 'ARCHIVED' as const, createdAt: 'May 16, 2025', createdById: '1', createdByName: 'System', firstTimeOffender: true, residentialStability: true, employmentStatus: 'EMPLOYED', dependents: 1, previousCourtAppearances: 0, previousAbsconding: false, witnessTampering: false, coAccused: false, evidenceType: 'DOCUMENTARY', caseStage: 'INVESTIGATION', suretyAvailable: true, bondReady: true, identificationReady: true, updatedAt: 'May 16, 2025' },
                          { id: '4', caseNumber: 'Case #BR-2025-0009', offenceSection: 'IPC 498A, 323', status: 'EVALUATED' as const, createdAt: 'May 15, 2025', createdById: '1', createdByName: 'System', firstTimeOffender: true, residentialStability: true, employmentStatus: 'EMPLOYED', dependents: 1, previousCourtAppearances: 0, previousAbsconding: false, witnessTampering: false, coAccused: false, evidenceType: 'DOCUMENTARY', caseStage: 'INVESTIGATION', suretyAvailable: true, bondReady: true, identificationReady: true, updatedAt: 'May 15, 2025' },
                        ]
                    ).map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF7FC] transition-colors">
                        <td className="py-3 font-semibold text-[#1F1D36]">{c.caseNumber}</td>
                        <td className="py-3">
                          <CitationChip section={`Sec. ${c.offenceSection}`} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigate(`/cases/${c.id}/verdict`)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#403D88] bg-[#F8F7FC] hover:bg-[#EBE5F5] border border-[#EBE5F5] transition-colors cursor-pointer"
                          >
                            View Verdict
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Eligibility Summary Circular Gauge (1/3 width) */}
            <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1F1D36]">Eligibility Summary</h2>
                <p className="text-xs text-[#6B6888]">Legal success rate</p>
              </div>

              <div className="flex flex-col items-center justify-center my-2">
                <div className="w-28 h-28 rounded-full border-8 border-[#403D88] border-t-[#F8B2B2] flex items-center justify-center relative shadow-inner">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold text-[#403D88] block">62%</span>
                    <span className="text-[9px] text-[#6B6888] uppercase font-bold">Eligibility</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#EBE5F5] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6888] font-medium">5 Eligible</span>
                  <span className="text-xs font-bold text-emerald-600">High</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6888] font-medium">4 Pending Review</span>
                  <span className="text-xs font-bold text-amber-600">Medium</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6888] font-medium">3 Under Conditions</span>
                  <span className="text-xs font-bold text-[#8B639B]">Requires Action</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Legal Advice Banner */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#F8B2B2] via-[#AF719D] to-[#8B639B] text-white shadow-lg shadow-black/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-extrabold">Need personalized legal advice?</h3>
                <p className="text-xs md:text-sm text-white/90 mt-1">
                  Connect with our legal aid experts for professional guidance on bail bonds.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenChat}
              className="px-6 py-3 rounded-2xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs md:text-sm font-bold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Talk to a Lawyer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Actions, Upcoming Hearings & Recent Activity */}
        <div className="space-y-8">
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F1D36]">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cases/new')}
                className="w-full p-3.5 rounded-2xl bg-[#F8F7FC] hover:bg-[#F3EEF9] border border-[#EBE5F5] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8B2B2]/30 text-[#AF719D] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#1F1D36] block">Start New Case Check</span>
                    <span className="text-[10px] text-[#6B6888]">Begin a new eligibility check</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9B98B4] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenChat}
                className="w-full p-3.5 rounded-2xl bg-[#F8F7FC] hover:bg-[#F3EEF9] border border-[#EBE5F5] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8B639B]/20 text-[#403D88] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#1F1D36] block">AI Legal Assistant</span>
                    <span className="text-[10px] text-[#6B6888]">Get legal guidance instantly</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9B98B4] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/laws')}
                className="w-full p-3.5 rounded-2xl bg-[#F8F7FC] hover:bg-[#F3EEF9] border border-[#EBE5F5] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#AF719D]/20 text-[#8B639B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#1F1D36] block">Browse Law Library</span>
                    <span className="text-[10px] text-[#6B6888]">Search IPC & BNS sections</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9B98B4] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/cases')}
                className="w-full p-3.5 rounded-2xl bg-[#F8F7FC] hover:bg-[#F3EEF9] border border-[#EBE5F5] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#403D88]/15 text-[#403D88] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-[#1F1D36] block">Upload Documents</span>
                    <span className="text-[10px] text-[#6B6888]">Attach case FIRs & bonds</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9B98B4] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Upcoming Hearings Widget */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1F1D36]">Upcoming Hearings</h2>
              <span className="text-xs font-semibold text-[#8B639B] cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#F8B2B2]/30 text-[#403D88] font-mono text-center">
                    <span className="text-[9px] uppercase block font-bold">MAY</span>
                    <span className="text-sm font-extrabold block">20</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F1D36]">Case #BR-2025-0012</h4>
                    <p className="text-[10px] text-[#6B6888]">District Court, Delhi</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#403D88]">10:30 AM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#8B639B]/20 text-[#403D88] font-mono text-center">
                    <span className="text-[9px] uppercase block font-bold">MAY</span>
                    <span className="text-sm font-extrabold block">22</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F1D36]">Case #BR-2025-0009</h4>
                    <p className="text-[10px] text-[#6B6888]">Sessions Court, Delhi</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#403D88]">02:00 PM</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1.5 rounded-xl bg-[#AF719D]/20 text-[#403D88] font-mono text-center">
                    <span className="text-[9px] uppercase block font-bold">MAY</span>
                    <span className="text-sm font-extrabold block">24</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F1D36]">Case #BR-2025-0011</h4>
                    <p className="text-[10px] text-[#6B6888]">District Court, Delhi</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#403D88]">11:00 AM</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F1D36]">Recent Activity</h2>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#1F1D36] font-medium">Case #BR-2025-0012 marked as <span className="font-bold text-emerald-600">Eligible</span></p>
                  <span className="text-[10px] text-[#9B98B4]">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#AF719D] mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#1F1D36] font-medium">New document uploaded in Case #BR-2025-0011</p>
                  <span className="text-[10px] text-[#9B98B4]">5 hours ago</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#403D88] mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#1F1D36] font-medium">AI Assistant used for Case #BR-2025-0010</p>
                  <span className="text-[10px] text-[#9B98B4]">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerStrip />
    </div>
  )
}

/* =========================================================================
   2. LAWYER DASHBOARD VIEW (Customized for Defense Attorneys)
   ========================================================================= */
export const LawyerDashboardView: React.FC<RoleViewProps> = ({ user, cases, onOpenChat }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#403D88]/10 text-[#403D88] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Defense Attorney Console
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
            Counsel Workspace — Advocate {user?.name}
          </h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            Active client bail applications, precedent analysis, and hearing schedules.
          </p>
        </div>
        <button
          onClick={() => navigate('/cases/new')}
          className="px-5 py-2.5 rounded-xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Draft New Application
        </button>
      </div>

      {/* Attorney Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Active Client Pleas</span>
          <div className="text-3xl font-extrabold text-[#403D88]">18</div>
          <span className="text-[11px] text-emerald-600 font-semibold">14 Under Sec. 436/437</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Rule Trace Verified</span>
          <div className="text-3xl font-extrabold text-[#8B639B]">12</div>
          <span className="text-[11px] text-[#9B98B4]">Rule Engine v2.4</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Court Dates This Week</span>
          <div className="text-3xl font-extrabold text-[#AF719D]">5</div>
          <span className="text-[11px] text-amber-600 font-semibold">2 Sessions Court, 3 High Court</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Bail Grant Rate</span>
          <div className="text-3xl font-extrabold text-[#10B981]">78%</div>
          <span className="text-[11px] text-[#9B98B4]">Based on precedent trace</span>
        </div>
      </div>

      {/* Main Lawyer Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1F1D36]">Priority Client Bail Applications</h2>
            <button onClick={() => navigate('/cases')} className="text-xs font-bold text-[#403D88]">View All Caseload →</button>
          </div>
          <div className="divide-y divide-[#F8F7FC]">
            {cases.slice(0, 5).map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1F1D36]">{item.caseNumber}</span>
                    <CitationChip section={`Sec. ${item.offenceSection}`} />
                  </div>
                  <p className="text-[11px] text-[#6B6888]">Custody: 120 days | First Offender: Yes</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <button
                    onClick={() => navigate(`/cases/${item.id}/verdict`)}
                    className="px-3 py-1.5 rounded-xl bg-[#403D88] text-white text-xs font-semibold hover:bg-[#312E6B] transition-colors"
                  >
                    Rule Trace
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lawyer AI Tools & Quick Research */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#1F1D36]">Legal Assistant Tools</h2>
            <div className="space-y-3">
              <button
                onClick={onOpenChat}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#F8B2B2]/20 via-[#AF719D]/20 to-[#8B639B]/20 border border-[#8B639B]/30 flex items-center gap-3 hover:border-[#403D88] transition-all text-left"
              >
                <Bot className="w-6 h-6 text-[#403D88]" />
                <div>
                  <h4 className="text-xs font-bold text-[#1F1D36]">AI Precedent Finder</h4>
                  <p className="text-[10px] text-[#6B6888]">Find Supreme Court citations for bail grounds</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/laws')}
                className="w-full p-4 rounded-2xl bg-[#F8F7FC] border border-[#EBE5F5] flex items-center gap-3 hover:border-[#8B639B]/30 transition-all text-left"
              >
                <BookOpen className="w-6 h-6 text-[#8B639B]" />
                <div>
                  <h4 className="text-xs font-bold text-[#1F1D36]">IPC vs BNS Converter</h4>
                  <p className="text-[10px] text-[#6B6888]">Compare old and new criminal law sections</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   3. NGO ADMIN DASHBOARD VIEW (Humanitarian Aid & Pro-Bono Focus)
   ========================================================================= */
export const NgoDashboardView: React.FC<RoleViewProps> = ({ user, cases }) => {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5" /> Legal Aid NGO Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
            {user?.organizationName || 'Legal Rights Foundation'} Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            Undertrial prisoner welfare, bail bond funding, and pro-bono advocate allocation.
          </p>
        </div>
        <button
          onClick={() => navigate('/cases')}
          className="px-5 py-2.5 rounded-xl bg-[#403D88] hover:bg-[#312E6B] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <FolderKanban className="w-4 h-4" /> View All NGO Cases
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Undertrials Assisted</span>
          <div className="text-3xl font-extrabold text-[#403D88]">142</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Across 8 Prisons</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Pro-Bono Advocates</span>
          <div className="text-3xl font-extrabold text-[#8B639B]">28</div>
          <span className="text-[11px] text-[#9B98B4]">Active Panel</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Bail Fund Allocated</span>
          <div className="text-3xl font-extrabold text-[#AF719D]">₹ 4.5L</div>
          <span className="text-[11px] text-[#9B98B4]">Surety assistance</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Successful Releases</span>
          <div className="text-3xl font-extrabold text-[#10B981]">64</div>
          <span className="text-[11px] text-emerald-600 font-semibold">This Quarter</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F1D36]">Undertrial Support Pipeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE5F5] text-[#9B98B4] font-semibold uppercase text-[10px]">
                <th className="pb-3">Prisoner Name / ID</th>
                <th className="pb-3">Facility</th>
                <th className="pb-3">Section</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Surety Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F7FC]">
              {cases.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-semibold text-[#1F1D36]">{c.createdByName || 'Undertrial #882'}</td>
                  <td className="py-3 text-[#6B6888]">Tihar Jail No. 4</td>
                  <td className="py-3"><CitationChip section={`Sec. ${c.offenceSection}`} /></td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                  <td className="py-3 text-right font-bold text-emerald-600">Fund Allocated</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   4. COURT STAFF DASHBOARD VIEW (Judicial & Registry Officer)
   ========================================================================= */
export const CourtStaffDashboardView: React.FC<RoleViewProps> = ({ user, cases }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-[#403D88] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5" /> Judicial Registry Officers
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
            Court Bench Registry — Officer {user?.name}
          </h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            Bail application verification, Section 436 compliance check, and decision entry logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Submitted for Bench Review</span>
          <div className="text-3xl font-extrabold text-[#403D88]">34</div>
          <span className="text-[11px] font-semibold text-amber-600">8 Urgent Matters</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Deterministic Verified</span>
          <div className="text-3xl font-extrabold text-[#10B981]">29</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Rule Engine Trace</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Avg Docket Disposal Time</span>
          <div className="text-3xl font-extrabold text-[#8B639B]">1.2 Days</div>
          <span className="text-[11px] text-[#9B98B4]">Standard target: &lt; 2 Days</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Bonds Logged Today</span>
          <div className="text-3xl font-extrabold text-[#AF719D]">16</div>
          <span className="text-[11px] text-[#9B98B4]">Verified Sureties</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#1F1D36]">Judicial Registry Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE5F5] text-[#9B98B4] font-semibold uppercase text-[10px]">
                <th className="pb-3">CNR Number</th>
                <th className="pb-3">Offence Section</th>
                <th className="pb-3">Custody Period</th>
                <th className="pb-3">Rule Result</th>
                <th className="pb-3 text-right">Bench Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F7FC]">
              {cases.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-mono font-bold text-[#403D88]">{c.caseNumber}</td>
                  <td className="py-3"><CitationChip section={`Sec. ${c.offenceSection}`} /></td>
                  <td className="py-3 text-[#6B6888]">180 Days</td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                  <td className="py-3 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-[#403D88] text-white font-bold text-xs hover:bg-[#312E6B]">
                      Log Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   5. SYSTEM ADMIN DASHBOARD VIEW
   ========================================================================= */
export const AdminDashboardView: React.FC<RoleViewProps> = ({ user }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#8B639B] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Lock className="w-3.5 h-3.5" /> Superuser Control Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F1D36]">
            System Administration & Rule Engine — Admin {user?.name || 'Superuser'}
          </h1>
          <p className="text-xs md:text-sm text-[#6B6888] mt-1">
            System status, legal repository versions, user provisioning, and audit logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">System Health & Uptime</span>
          <div className="text-3xl font-extrabold text-emerald-600">99.98%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Backend Operational</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Rule Engine Engine</span>
          <div className="text-3xl font-extrabold text-[#403D88]">v2.4.0</div>
          <span className="text-[11px] text-[#9B98B4]">IPC & BNS Rule Traces</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Total Users</span>
          <div className="text-3xl font-extrabold text-[#8B639B]">1,280</div>
          <span className="text-[11px] text-[#9B98B4]">5 Roles Provisioned</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5F5] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-[#6B6888]">Daily AI Queries</span>
          <div className="text-3xl font-extrabold text-[#AF719D]">3,420</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+ 14% this week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#1F1D36] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#403D88]" /> Legal Rule Engine Versioning
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#F8F7FC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#1F1D36]">Bail Rules Engine (IPC Sec. 436/437)</span>
                <p className="text-[10px] text-[#6B6888]">Active in production</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F7FC] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#1F1D36]">BNSS 2023 Cross-Map Rules</span>
                <p className="text-[10px] text-[#6B6888]">Active in production</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EBE5F5] shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#1F1D36] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#8B639B]" /> Security & Audit Log
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#6B6888]">
              <span>JWT Authentication Audit</span>
              <span className="font-bold text-emerald-600">Clean (0 Errors)</span>
            </div>
            <div className="flex items-center justify-between text-[#6B6888]">
              <span>Role Permissions Matrix</span>
              <span className="font-bold text-[#403D88]">Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
