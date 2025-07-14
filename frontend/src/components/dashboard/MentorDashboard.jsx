import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, DollarSign, Users, Star, Clock, Video, MessageCircle, CheckCircle, XCircle, User, Sun, Moon, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../hooks/use-toast.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Switch } from '../ui/switch.jsx';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover.jsx';


const upcomingSessions = [
  {
    id: 1,
    studentName: 'Manav Singh',
    topic: 'Exam Strategy for Final Year',
    startTime: '2025-07-13T20:00:00', // 8:00 PM Today
    type: 'video'
  },
  {
    id: 2,
    studentName: 'Isha Kaur',
    topic: 'Managing Backlogs',
    startTime: '2025-07-14T10:30:00',
    type: 'chat'
  }
];



const sessionRequests = [
  {
    id: 1,
    studentName: 'Anjali Gupta',
    topic: 'Campus Life & Hostel Experience',
    requestedTime: '2:00 PM Today',
    amount: 99,
    type: 'video',
    status: 'pending'
  },
  {
    id: 2,
    studentName: 'Rohan Shah',
    topic: 'Placement Preparation Tips',
    requestedTime: '4:30 PM Today',
    amount: 99,
    type: 'chat',
    status: 'pending'
  },
  {
    id: 3,
    studentName: 'Kavya Reddy',
    topic: 'Faculty & Course Selection',
    requestedTime: '6:00 PM Today',
    amount: 99,
    type: 'video',
    status: 'pending'
  }
];

const recentSessions = [
  {
    id: 1,
    studentName: 'Arjun Mehta',
    topic: 'Internship Opportunities',
    completedTime: '2 hours ago',
    duration: '45 min',
    rating: 5,
    earnings: 99
  },
  {
    id: 2,
    studentName: 'Nisha Sharma',
    topic: 'Research Projects',
    completedTime: '1 day ago',
    duration: '30 min',
    rating: 4,
    earnings: 99
  }
];

const MentorDashboard = () => {

  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [acceptedSessions, setAcceptedSessions] = useState({});


  const handleAcceptRequest = (studentName, requestId) => {
    setAcceptedSessions((prev) => ({ ...prev, [requestId]: true }));

    toast({
      title: 'Request Accepted',
      description: `Session with ${studentName} has been confirmed.`,
    });
  };

  const handleJoinSession = (session) => {
    const now = new Date();
    const sessionTime = new Date(session.startTime);
    const timeDiffInMinutes = (sessionTime - now) / (1000 * 60);

    if (timeDiffInMinutes > 10) {
      toast({
        title: "Too Early to Join",
        description: "You can only join within 10 minutes before the session starts.",
        variant: "destructive"
      });
      return;
    }

    if (now < sessionTime) {
      toast({
        title: "Wait for Session Time",
        description: "Session time hasn't started yet. Please wait a bit.",
      });
      return;
    }

    navigate(`/mentor/${session.id}`);
  };



  const handleDeclineRequest = (studentName, requestId) => {
    toast({
      title: 'Request Declined',
      description: `Session request from ${studentName} has been declined.`,
    });
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "You're now offline" : "You're now online",
      description: isOnline ? "Students won't see you as available " : "Students are now able to request quick section",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Offline</span>
              <Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
              <span className="text-sm">Online</span>
              {/* {isOnline && <Badge className="bg-green-500">Available</Badge>} */}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'U'}`}
                  alt="profile"
                  className="w-9 h-9 rounded-full border cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="text-sm font-semibold mb-1">{user?.name}</div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/mentor/profile')}
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <><Sun className="w-4 h-4 mr-2" /> Light</>
                  ) : (
                    <><Moon className="w-4 h-4 mr-2" /> Dark</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(user?.totalSessions || 0) * 99}</div>
              <p className="text-xs text-muted-foreground">
                +₹198 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.rating || 0}</div>
              <p className="text-xs text-muted-foreground">
                Based on {user?.totalSessions || 0} reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your response
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Session Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Session Requests</CardTitle>
              <CardDescription>Students waiting for your confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{request.studentName}</h4>
                        <p className="text-sm text-gray-600">{request.topic}</p>
                        <p className="text-sm text-gray-500 mt-1">{request.requestedTime}</p>
                      </div>
                      <div className="text-right">
                        
                        <p className="text-lg font-bold text-green-600 mt-1">₹{request.amount}</p>
                      </div>
                    </div>

                    {acceptedSessions[request.id] ? (
                      <div className="flex flex-col items-start space-y-2">
                        <div className="flex items-center text-sm text-orange-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Waiting for payment...
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.studentName, request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.studentName, request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Sessions scheduled in the next 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => {
                  const now = new Date();
                  const sessionTime = new Date(session.startTime);
                  const timeDiffInMinutes = (sessionTime - now) / (1000 * 60);

                  return (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{session.studentName}</h4>
                          <p className="text-sm text-gray-600">{session.topic}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {sessionTime.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleJoinSession(session)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join Now
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>



          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Your completed mentoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{session.studentName}</h4>
                        <p className="text-sm text-gray-600">{session.topic}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {session.completedTime} • {session.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < session.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-lg font-bold text-green-600">₹{session.earnings}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Mentor Profile</CardTitle>
            <CardDescription>
              How students see you on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {user?.name}</div>
                  <div><span className="font-medium">College:</span> {user?.college}</div>
                  <div><span className="font-medium">Verification:</span>
                    <Badge className={user?.verified ? "bg-green-500 ml-2" : "bg-yellow-500 ml-2"}>
                      {user?.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Stats</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Rating:</span> {user?.rating}/5.0</div>
                  <div><span className="font-medium">Sessions:</span> {user?.totalSessions}</div>
                  <div><span className="font-medium">Status:</span>
                    <Badge className={isOnline ? "bg-green-500 ml-2" : "bg-gray-500 ml-2"}>
                      {isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;
