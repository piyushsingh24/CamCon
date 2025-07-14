// StudentDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Star, MessageCircle, Clock, Users, LogOut, Sun, Moon, User, Search } from 'lucide-react';
import { Button } from "../ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";
import { Input } from "../ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../hooks/use-toast.js";
import { useTheme } from "../../contexts/ThemeContext.jsx";


export const colleges = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'DTU Delhi', 'NSUT Delhi',
  'IIT Roorkee', 'IIT Guwahati', 'IIT BHU', 'IIT Indore', 'IIT Gandhinagar',
  'IIIT Bangalore', 'IIIT Delhi', 'IIIT Allahabad', 'NIT Surathkal', 'NIT Warangal',
  'NIT Rourkela', 'NIT Calicut', 'NIT Jaipur', 'VIT Vellore', 'SRM Institute of Science and Technology',
  'Manipal Institute of Technology', 'Amrita Vishwa Vidyapeetham', 'Shiv Nadar University',
  'Jadavpur University', 'University of Hyderabad'
];

export const mentors = [
  {
    id: 1,
    name: "Ananya Sharma",
    college: "IIT Delhi",
    email: "ananya.sharma@example.com",
    course: "Computer Science",
    year: "3rd Year",
    expertise: "Web Development",
    rating: 4.8,
    sessions: 35,
    isOnline: true,
    price: 99,
    specialties: ["React", "JavaScript", "UI/UX"],
  },
  {
    id: 2,
    name: "Ravi Mehta",
    college: "NIT Trichy",
    email: "ravi.mehta@example.com",
    course: "Electronics & Communication",
    year: "Final Year",
    expertise: "Data Structures & Algorithms",
    rating: 4.6,
    sessions: 50,
    isOnline: false,
    price: 99,
    specialties: ["product design", "marketing ", "communication"],
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    college: "IIIT Hyderabad",
    email: "sneha.kapoor@example.com",
    course: "Artificial Intelligence",
    year: "2nd Year",
    expertise: "Machine Learning",
    rating: 4.9,
    sessions: 60,
    isOnline: true,
    price: 99,
    specialties: ["event organiser", "public speaking", "college president"],
  },
  {
    id: 4,
    name: "Arjun Verma",
    college: "BITS Pilani",
    email: "arjun.verma@example.com",
    course: "Information Systems",
    year: "3rd Year",
    expertise: "DevOps",
    rating: 4.7,
    sessions: 42,
    isOnline: false,
    price: 99,
    specialties: ["Docker", "AWS", "CI/CD"],
  },
  {
    id: 5,
    name: "Priya Singh",
    college: "VIT Vellore",
    email: "priya.singh@example.com",
    course: "Cybersecurity",
    year: "Final Year",
    expertise: "Cybersecurity",
    rating: 4.5,
    sessions: 38,
    isOnline: true,
    price: 99,
    specialties: ["Ethical Hacking", "Network Security", "Linux"],
  },
];

const acceptedMentors = [mentors[0], mentors[2]];
const scheduledMentors = [mentors[1]];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestedMentors, setRequestedMentors] = useState([]);


  const filteredMentors = mentors.filter(mentor =>
    (!selectedCollege || mentor.college === selectedCollege) &&
    (!searchTerm || mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleBookSession = (mentor) => {
    toast({
      title: "Session Requested",
      description: `Waiting for ${mentor.name}'s acceptance...`,
    });

    setRequestedMentors((prev) => [...prev, mentor.id]);
  };



  const [acceptedMentors, setAcceptedMentors] = useState([
    { id: 1, name: "Aman Tiwari", college: "IIT Delhi" },
    { id: 2, name: "Sneha Joshi", college: "NIT Trichy" },
  ]);

  const [scheduledMentors, setScheduledMentors] = useState([
    { id: 3, name: "Raghav Rao", course: "CSE" },
  ]);

  const handlePayment = (mentor) => {
    setScheduledMentors((prev) => [
      ...prev,
      {
        id: mentor.id,
        name: mentor.name,
        course: mentor.college, // You can adjust this field if needed
      },
    ]);

    setAcceptedMentors((prev) => prev.filter((m) => m.id !== mentor.id));
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
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'U'}`}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/student/profile")}> <User className="h-4 w-4 mr-2" /> Profile </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === 'dark'
                  ? <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                  : <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}> <LogOut className="h-4 w-4 mr-2" /> Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

        <div className="mb-7 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="animate-bounce">Accepted Requests</CardTitle>
              <CardDescription>These mentors accepted your request</CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedMentors.length === 0 ? (
                <p className="text-sm text-gray-500">No accepted mentors yet.</p>
              ) : (
                acceptedMentors.map((m) => (
                  <div key={m.id} className="mb-4 text-sm">
                    <div className="flex justify-between items-center">
                      <a href={`/mentor/${m.id}`}>
                        <span>{m.name} ({m.college})</span>
                      </a>
                      <div className="flex items-center space-x-2">
                        <Badge variant="success">Accepted</Badge>
                        <Button size="sm" onClick={() => handlePayment(m)}>Pay Now</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="animate-bounce">Scheduled Sessions</CardTitle>
              <CardDescription>Your upcoming mentor calls</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledMentors.length === 0 ? (
                <p className="text-sm text-gray-500">No sessions scheduled.</p>
              ) : (
                scheduledMentors.map((m) => (
                  <a key={m.id} href={`/mentor/${m.id}`} className="cursor-pointer">
                    <div className="mb-2 text-sm flex justify-between">
                      <span>{m.name} ({m.course})</span>
                      <Badge variant="default">Tomorrow 5PM</Badge>
                    </div>
                  </a>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Your Perfect Mentor</CardTitle>
            <CardDescription>Search by college, course, or mentor specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search mentors, courses, or specialties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <Card key={mentor.id} className="relative">
              {mentor.isOnline && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">Online</Badge>
              )}
              <CardHeader>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.course} • {mentor.year}</CardDescription>
                <p className="text-sm text-blue-600">{mentor.college}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" /> {mentor.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {mentor.sessions} sessions
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-sm">Specialties:</div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {mentor.specialties.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                  ))}
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">₹{mentor.price}</div>
                <div className="space-y-2">
                  {requestedMentors.includes(mentor.id) ? (
                    <div className="w-full text-center text-sm text-orange-600 font-medium border border-orange-400 rounded-md py-2">
                      ⏳ Waiting for acceptance...
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleBookSession(mentor)}>
                      <MessageCircle className="w-4 h-4 mr-2" /> Request Session
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" onClick={() => navigate(`/mentor/${mentor.id}`)}>
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
              <Button onClick={() => { setSelectedCollege(''); setSearchTerm(''); }}>Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
