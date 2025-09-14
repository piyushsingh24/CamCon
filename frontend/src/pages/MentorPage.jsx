import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Phone, Video } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const API_URL = "http://localhost:5000"; // Replace with your API base URL

const MentorDataPage = () => {
  const { mentorId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mentors/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentor: mentorId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load mentor data");

        setMentor(data.mentor);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  const handleBookSession = async (mentorId, mentorName) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user._id,
          mentorId,
          mentorName,
          studentName: user.name,
        }),
        credentials: "include",
      });

      if (res.ok) {
        toast({
          title: "Session Requested",
          description: "Waiting for mentor acceptance.",
        });
        setRequestedMentorIds(prev => [...prev, mentorId]);
      } else {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to request session.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Server error. Please try again.",
      });
    }
  };

  if (loading) return <p className="text-center p-4">Loading mentor profile...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <img
            src={mentor.profilePicture || "/images/mentor.jpg"}
            alt={mentor.name}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{mentor.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-1">{"college : " + mentor.college}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-1">{"course/branch : "+mentor.branch}</p>

          {/* Request Session Button */}
          <Button
            onClick={() => handleBookSession(mentor._id, mentor.name)}
            disabled={requestedMentorIds.includes(mentor._id)}
            className="mt-4"
          >
            {requestedMentorIds.includes(mentor._id) ? "Session Requested" : "Request Session"}
          </Button>


          {/* in future mai logic add kr skta hu aagr user is session wise payment kiya huwa hei toh reqest session show nhi
          and call and video call show hoga  */}
          {/* yeah krne ke liye hum simple session details ko contexts ke andr pass krdenge and khii bhi use krlenge */}



          {/* <div className="flex gap-4 mt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-5 h-5" /> Call
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Video className="w-5 h-5" /> Video Call
            </Button>
          </div> */}
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        {/* Ratings & Stats */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Mentor Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Rating:</strong> {mentor.rating?.average} ⭐ ({mentor.rating?.count} reviews)</p>
            <p><strong>Total Sessions Conducted:</strong> {mentor.totalSessions || "N/A"}</p>
          </CardContent>
        </Card>

        {/* About Mentor */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>About Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Specialization:</strong> {mentor.specialization || "N/A"}</p>
            <p><strong>Bio:</strong></p>
            <p>{mentor.bio || "No bio provided."}</p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {mentor.history?.map((item, idx) => (
                <li key={idx}>{item}</li>
              )) || <li>No history available.</li>}
            </ul>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Student Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.reviews?.length ? mentor.reviews.map((review, idx) => (
              <div key={idx} className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="italic">"{review.text}"</p>
                <p className="font-semibold mt-1">- {review.reviewer}</p>
              </div>
            )) : <p>No reviews yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDataPage;
