import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Star, MessageCircle, Clock, Users, LogOut, Sun, Moon, User, Search } from 'lucide-react';
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";
import { Input } from "../ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { fetchMentors } from '../../contexts/mentorService.js';
import PaymentModal from '../../pages/Checkout.jsx'

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [colleges, setColleges] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [acceptedSessions, setAcceptedSessions] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Load mentors
  useEffect(() => {
    const loadMentors = async () => {
      const data = await fetchMentors();
      if (data) setMentors(data.mentors);
      else setMentors([]);
    };
    loadMentors();
  }, []);

  // Load sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch(`${API_URL}/api/sessions/student/${user._id}`);
      const data = await res.json();
      console.log(data)
      if (data.sessions) {
        setAcceptedSessions(data.sessions.filter(s => s.status === 'accepted'));
        setScheduledSessions(data.sessions.filter(s => s.status === 'scheduled'));
        setRequestedMentorIds(data.sessions.filter(s => s.status === 'requested').map(s => s.mentorId));
      }
    };

    fetchSessions();
  });

  const filteredMentors = mentors.filter(mentor =>
    (!selectedCollege || mentor.college === selectedCollege) &&
    (!searchTerm ||
      mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Handle Request Session 
  const handleBookSession = async (mentor, name) => {
    const res = await fetch(`${API_URL}/api/sessions/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user._id, mentorId: mentor, mentorName: name, studentName: user.name }),
      credentials: 'include'
    });

    if (res.ok) {
      toast({
        title: "Session Requested",
        description: `Waiting for Mentor acceptance.`
      });
      setRequestedMentorIds(prev => [...prev, mentor._id]);
    } else {
      const errorData = await res.json();
      toast({
        title: "Error",
        description: errorData.error || "Failed to request session."
      });
    }
  };


  const handlePayment = async (sessionId) => {
    navigate(`/payment/${sessionId}`)
  };

  return (


    <div className="min-h-screen bg-gray-200">



      <header className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'U'}`} alt="profile" className="w-8 h-8 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/student/profile")}>
                <User className="h-4 w-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === 'dark'
                  ? <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                  : <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Available Mentors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredMentors.length}</div>
              <p className="text-xs text-muted-foreground">{filteredMentors.filter(m => m.isOnline).length} online now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Session Price</CardTitle>
              <Badge variant="outline">₹99</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Affordable</div>
              <p className="text-xs text-muted-foreground">Get quality guidance at the lowest price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-sm">Success Rate</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">Students find sessions helpful</p>
            </CardContent>
          </Card>
        </div>

        {/* Accepted & Scheduled Sessions */}
        <div className="mb-7 grid md:grid-cols-2 gap-6 ">

          <Card>
            <CardHeader>
              <CardTitle className="animate-bounce">Accepted Requests</CardTitle>
              <CardDescription>Mentors accepted your session request</CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No accepted sessions yet.</p>
              ) : (
                acceptedSessions.map((s) => (
                  <div key={s._id} className="mb-4 text-sm flex justify-between items-center">
                    <a href={`/mentor/${s.mentorId}`}>
                      <span className='font-semibold text-lg'>{s.mentorName}</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Accepted</Badge>
                      <Button size="sm" onClick={() => { handlePayment(s._id) }}>Pay Now</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card >
            <CardHeader>
              <CardTitle className="animate-bounce">Scheduled Sessions</CardTitle>
              <CardDescription>Your upcoming mentor calls</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledSessions.length === 0 ? (
                <p className="text-sm text-gray-500">No scheduled sessions.</p>
              ) : (
                scheduledSessions.map((s) => (
                  <a key={s._id} className="cursor-pointer">
                    <div className="mb-2 text-sm flex justify-between text-black border-2 p-2 rounded-md">
                      <div>
                        <span className='font-semibold text-lg mr-1'>{s.mentorName}</span>
                      </div>
                      <Badge variant="default">
                        <a onClick={() => { navigate(`/mentor/${s._id}`) }}>Connect</a>
                      </Badge>
                    </div>
                  </a>
                ))
              )}
            </CardContent>
          </Card>

        </div>

        {/* Search Mentors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Perfect Mentor</CardTitle>
            <CardDescription>Search by college, course, or specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search mentors, courses, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger className="w-full md:w-2/4">
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem key={college} value={college}>{college}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor._id} className="relative">
              {mentor.isOnline && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">Online</Badge>
              )}
              <CardHeader>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.course} • {mentor.year}</CardDescription>
                <p className="text-sm text-blue-600">{mentor.college}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" /> {mentor.rating?.average || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {mentor.sessions || 0} sessions
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-2 text-sm">Specialties:</div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.specialties?.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                  ))}
                </div>

                <div className="text-2xl font-bold text-green-600 mb-2">₹{mentor.price || 99}</div>

                <div className="space-y-2">
                  {requestedMentorIds.includes(mentor._id) ? (
                    <div className="w-full text-center text-sm text-orange-600 font-medium border border-orange-400 rounded-md py-2">
                      ⏳ Waiting for acceptance...
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleBookSession(mentor._id, mentor.name)}>
                      <MessageCircle className="w-4 h-4 mr-2" /> Request Session
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" onClick={() => navigate(`/mentor/data/${mentor._id}`)}>
                    <User className="w-4 h-4 mr-2" /> View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <Card className="text-center py-8 mt-8">
            <CardContent>
              <p className="text-gray-500 mb-4">No mentors found matching your criteria</p>
              <Button onClick={() => { setSelectedCollege(''); setSearchTerm(''); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
