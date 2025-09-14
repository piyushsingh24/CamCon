import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, DollarSign, Users, Star, Clock, Video, User, Sun, Moon, CheckCircle, XCircle, ChartBar, MessageCircle } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';

import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Switch } from '../ui/switch.jsx';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover.jsx';

const API_URL = 'http://localhost:5000'; 

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(user?.isAvailable ?? true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;  // Ensure user._id is available

    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sessions/mentor/${user._id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error('Fetch sessions error:', err);
        toast({
          title: "Error",
          description: "Failed to load sessions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  });

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "You're now offline" : "You're now online",
      description: isOnline
        ? "Students won't see you as available"
        : "Students can now request sessions",
    });
    // Optionally send online status to backend
  };

const handleAcceptRequest = async (requestId, studentName) => {
  try {
    const res = await fetch(`${API_URL}/api/sessions/accept/${requestId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to accept session');

    toast({ title: "Accepted", description: `Session with ${studentName} confirmed.` });

    setSessions((prev) =>
      prev.map((s) => (s._id === requestId ? { ...s, status: 'accepted' } : s))
    );
  } catch (err) {
    toast({ title: "Error", description: "Failed to accept session.", variant: "destructive" });
  }
};


  const handleDeclineRequest = async (requestId, studentName) => {
    try {
      await fetch(`${API_URL}/api/sessions/decline/${requestId}`, { method: 'POST' });
      toast({ title: "Declined", description: `Session from ${studentName} declined.` });

      setSessions((prev) => prev.filter((s) => s._id !== requestId));
    } catch (err) {
      toast({ title: "Error", description: "Failed to decline session.", variant: "destructive" });
    }
  };

  const handleJoinSession = async (session) => {
   navigate(`/mentor/${session._id}`)
  };

  const scheduledSessionsToday = sessions.filter((s) => {
      return s.status === 'scheduled' && s.isPaymentDone == true;
  });

  const upcomingSessions = sessions.filter((s) => {
    return (s.status == "accepted" && s.isPaymentDone == true)
  });

  const pendingRequests = sessions.filter((s) => s.status === 'requested');

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
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/mentor/profile')}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
                  {theme === 'dark'
                    ? <><Sun className="w-4 h-4 mr-2" /> Light</>
                    : <><Moon className="w-4 h-4 mr-2" /> Dark</>}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Total Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <DollarSign className="h-6 w-6 text-green-500" />
              <div className="text-xl font-bold">₹{scheduledSessionsToday.length*99}</div>
              <div>Total Earnings</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Users className="h-6 w-6 text-blue-500" />
              <div className="text-xl font-bold">{scheduledSessionsToday.length || 0}</div>
              <div>Total Sessions</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Star className="h-6 w-6 text-yellow-500" />
              <div className="text-xl font-bold">{user?.rating?.average || 0}</div>
              <div>Average Rating</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Clock className="h-6 w-6 text-purple-500" />
              <div className="text-xl font-bold">{pendingRequests.length}</div>
              <div>Pending Requests</div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Session Requests</CardTitle>
            <CardDescription>Students waiting for your confirmation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading
              ? <p>Loading...</p>
              : pendingRequests.length === 0
                ? <p className="text-gray-500">No pending requests</p>
                : pendingRequests.map((req) => (
                    <div key={req._id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{req.studentName}</h4>
                        <p className="text-sm text-gray-600">{req.topic}</p>
                        <p className="text-sm text-gray-500">Date will mentioned Later</p>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => handleAcceptRequest(req._id, req.studentName)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeclineRequest(req._id, req.studentName)}>
                          <XCircle className="h-4 w-4 mr-1" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))}
          </CardContent>
        </Card>

        {/* Scheduled 's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle> Scheduled Sessions</CardTitle>
            <CardDescription>Sessions confirmed for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledSessionsToday.length === 0
              ? <p className="text-gray-500">No sessions today</p>
              : scheduledSessionsToday.map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">
                        <a href="">
                          {session.studentName}
                        </a>
                      </h4>
                      <h6>Meeting Time will announce</h6>
                    </div>
                    <Button size="sm" onClick={() => handleJoinSession(session)}>
                      <MessageCircle className="h-4 w-4 mr-1" /> Join Now
                    </Button>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Completed Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Future scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length === 0
              ? <p className="text-gray-500">No upcoming sessions</p>
              : upcomingSessions.map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{session.studentName}</h4>
                      <p className="text-sm text-gray-600">{session.topic}</p>
                      <p className="text-sm text-gray-500">{new Date(session.startTime).toLocaleString()}</p>
                    </div>
                    <Button size="sm" onClick={() => handleJoinSession(session)}>
                      <Video className="h-4 w-4 mr-1" /> Join Now
                    </Button>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;
