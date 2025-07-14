import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { GraduationCap, Video, MessageCircle, Shield, Star, Zap } from "lucide-react";
import { Parallax } from 'react-scroll-parallax';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const features = [
  {
    title: "Live Video Calls",
    desc: "Real-time, high-quality video calls with verified seniors from your dream college.",
    icon: Video,
    bg: "bg-gradient-to-r from-blue-200 to-indigo-200",
  },
  {
    title: "Instant Chat",
    desc: "Message mentors instantly and get quick solutions to your college doubts.",
    icon: MessageCircle,
    bg: "bg-gradient-to-r from-pink-200 to-purple-200",
  },
  {
    title: "Verified Mentors",
    desc: "All our mentors go through a strict verification process to ensure authenticity.",
    icon: Shield,
    bg: "bg-gradient-to-r from-green-200 to-teal-200",
  },
  {
    title: "Rating System",
    desc: "Mentors are reviewed and rated to ensure high-quality support.",
    icon: Star,
    bg: "bg-gradient-to-r from-yellow-200 to-orange-200",
  },
  {
    title: "Lightning Fast Connect",
    desc: "Connect instantly with available mentors to get help when you need it the most.",
    icon: Zap,
    bg: "bg-gradient-to-r from-blue-200 to-cyan-200",
  },
];

const timeline = [
  {
    year: "2024",
    title: "CamCon Idea Born",
    desc: "Inspired by the gap in college mentorship, CamCon was envisioned to connect students with seniors."
  },
  {
    year: "2025",
    title: "Beta Launched",
    desc: "Early adopters helped refine the platform for optimal user experience."
  },
  {
    year: "2025",
    title: "100+ Students Served",
    desc: "A breakthrough year with massive user growth and expanded mentor network."
  },
  {
    year: "2025",
    title: "Official Partnerships with multiple tech giant community",
    desc: "Partnered with top Community and education fairs across India."
  }
];

const developers = [
  {
  name: "Piyush Singh",
  title: "Full-Stack Magician",
  desc: "Writes backend logic like poetry. Debugs in his dreams.",
  github: "https://github.com/piyushsingh24",
  linkedin: "https://www.linkedin.com/in/piyushsingh23",
  twitter: "#",
  imageUrl: "/public/images/mentor.jpg" 
}


  //add more developer details if its available
];

const LearnMore = () => {
  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-transparent flex flex-col justify-center items-center px-6 text-center py-24"
      >
        <GraduationCap className="w-12 h-12 text-blue-700 mb-4 animate-bounce" />
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text">
          CamCon: Learn More
        </h1>
        <p className="max-w-2xl text-gray-600 text-lg mb-6">
          A timeline of trust. A journey of transformation. Let’s build your future together.
        </p>
        <div className="space-x-4">
          <a href="/login">

          <Button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-xl transition-all">
            Get Started
          </Button>
          </a>

          <a href="/">

          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl">
            Go to Home
          </Button>
          </a>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-20 relative inline-block">
          What Makes Us Special?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, rotate: -2 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl"
            >
              <div className={`w-20 h-20 flex items-center justify-center rounded-full ${item.bg} shadow-inner mb-6`}>
                <item.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gradient-to-r from-white to-blue-50 py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Our Journey</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="border-l-4 border-blue-500 ml-4">
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-12 pl-6 relative"
              >
                <div className="absolute left-[-12px] top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
                <h4 className="text-xl font-semibold text-blue-700">{event.year} - {event.title}</h4>
                <p className="text-gray-600">{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Website */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <motion.h2 className="text-3xl font-bold mb-4 text-blue-800">About CamCon</motion.h2>
        <motion.p className="text-gray-700 text-lg leading-8">
          CamCon is a mentorship platform dedicated to bridging the gap between aspiring students and experienced college seniors. With features like live video calls, instant chat, verified mentors, and a secure interface, CamCon empowers students to seek personalized guidance. Whether it’s college entrance, course selection, or career advice — CamCon connects students with real mentors from top institutions. Built with a mission to democratize mentorship, the platform ensures that every student gets access to quality advice, anytime and anywhere.
        </motion.p>
      </section>

      {/* How to Use Section */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <motion.h2 className="text-3xl font-bold mb-8 text-blue-800">How to Use CamCon</motion.h2>
        <ul className="text-left max-w-xl mx-auto space-y-4 text-lg text-gray-700">
          <li>✅ Sign up with your student email</li>
          <li>✅ Browse verified mentors by college or stream</li>
          <li>✅ Schedule a live call or chat instantly</li>
          <li>✅ Get doubts cleared in real time</li>
          <li>✅ Rate mentors and help improve the community</li>
        </ul>
      </section>

      {/* Developer Team Section */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50 px-6">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Meet Our Dev Team</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">A squad of passionate builders who turned caffeine and code into CamCon 🚀</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border"
            >

              {/* //add the image here */}
              {/* <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {dev.name.split(" ")[0][0]}
              </div> */}

              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-4">
                <img
                  src={dev.imageUrl} // replace with the actual image URL or path
                  alt={dev.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">{dev.name}</h3>
              <p className="text-sm text-gray-500">{dev.title}</p>
              <p className="text-sm text-gray-600 mb-4">{dev.desc}</p>
              <div className="flex justify-center gap-4 text-xl">
                <a href={dev.github} target="_blank" rel="noreferrer" title="GitHub" className="text-gray-700 hover:text-black">
                  <FaGithub />
                </a>
                <a href={dev.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="text-blue-700 hover:text-blue-900">
                  <FaLinkedin />
                </a>
                <a href={dev.twitter} target="_blank" rel="noreferrer" title="Twitter" className="text-blue-500 hover:text-blue-700">
                  <FaTwitter />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
