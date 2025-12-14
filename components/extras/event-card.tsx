
// const eventsData = [
//   {
//     id: 1,
//     title: "Leadership Summit 2025",
//     date: "March 15, 2025",
//     time: "9:00 AM - 5:00 PM",
//     location: "Koforidua Conference Hall",
//     category: "Workshop",
//     status: "upcoming",
//     attendees: 45,
//     maxAttendees: 100,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
//     description: "Join industry leaders for a full day of inspiring talks and networking opportunities.",
//   },
//   {
//     id: 2,
//     title: "Tech Innovation Forum",
//     date: "March 22, 2025",
//     time: "2:00 PM - 6:00 PM",
//     location: "Virtual Event",
//     category: "Seminar",
//     status: "upcoming",
//     attendees: 120,
//     maxAttendees: 200,
//     image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80",
//     description: "Explore cutting-edge technologies and their impact on business transformation.",
//   },
//   {
//     id: 3,
//     title: "Career Development Workshop",
//     date: "February 28, 2025",
//     time: "10:00 AM - 1:00 PM",
//     location: "AIMS Hub, Accra",
//     category: "Workshop",
//     status: "past",
//     attendees: 75,
//     maxAttendees: 75,
//     image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
//     description: "Learn essential skills for advancing your career in today's competitive market.",
//   },
//   {
//     id: 4,
//     title: "Networking Mixer",
//     date: "April 5, 2025",
//     time: "6:00 PM - 9:00 PM",
//     location: "Rooftop Lounge, Tema",
//     category: "Networking",
//     status: "upcoming",
//     attendees: 30,
//     maxAttendees: 60,
//     image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
//     description: "Connect with professionals and entrepreneurs in a relaxed evening setting.",
//   },
//   {
//     id: 5,
//     title: "Entrepreneurship Bootcamp",
//     date: "February 10, 2025",
//     time: "9:00 AM - 3:00 PM",
//     location: "Innovation Hub, Kumasi",
//     category: "Bootcamp",
//     status: "past",
//     attendees: 50,
//     maxAttendees: 50,
//     image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80",
//     description: "Intensive training on launching and scaling your startup successfully.",
//   },
//   {
//     id: 6,
//     title: "Women in Tech Summit",
//     date: "April 18, 2025",
//     time: "1:00 PM - 5:00 PM",
//     location: "Tech Park, Accra",
//     category: "Summit",
//     status: "upcoming",
//     attendees: 85,
//     maxAttendees: 150,
//     image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=80",
//     description: "Celebrating and empowering women making strides in technology.",
//   },
// ];

// interface Event {
//   id: number;
//   title: string;
//   date: string;
//   time: string;
//   location: string;
//   category: string;
//   status: string;
//   attendees: number;
//   maxAttendees: number;
//   image: string;
//   description: string;
// }

// function EventCard({ event }: { event: Event }) {
//   const [isHovered, setIsHovered] = useState(false);

//   const progressPercentage = (event.attendees / event.maxAttendees) * 100;

//   return (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className="group bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
//     >
//       {/* Image Container */}
//       <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden bg-muted">
//         <img
//           src={event.image}
//           alt={event.title}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />

//         {/* Status Badge */}
//         <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
//           <span
//             className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-light tracking-wide backdrop-blur-md shadow-lg ${
//               event.status === "upcoming"
//                 ? "bg-secondary/90 text-secondary-foreground"
//                 : "bg-muted/90 text-muted-foreground"
//             }`}
//           >
//             {event.status === "upcoming" ? "Upcoming" : "Past Event"}
//           </span>
//         </div>

//         {/* Category Badge */}
//         <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
//           <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-light tracking-wide bg-primary/90 text-primary-foreground backdrop-blur-md shadow-lg">
//             {event.category}
//           </span>
//         </div>
//       </div>

//       {/* Content Container */}
//       <div className="p-5 sm:p-6 md:p-7 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 flex flex-col flex-1">
//         <h3 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide leading-tight group-hover:text-primary transition-colors duration-300">
//           {event.title}
//         </h3>

//         <p className="text-sm sm:text-base font-light text-muted-foreground line-clamp-2 leading-relaxed">
//           {event.description}
//         </p>

//         {/* Event Details */}
//         <div className="space-y-2 sm:space-y-2.5 md:space-y-3 text-sm sm:text-base font-light flex-1">
//           <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>{event.date}</span>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>{event.time}</span>
//           </div>

//           <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
//             <svg
//               className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>{event.location}</span>
//           </div>
//         </div>

//         {/* Attendees Progress - Only for upcoming events */}
//         {event.status === "upcoming" && (
//           <div className="space-y-2 sm:space-y-2.5">
//             <div className="flex justify-between text-xs sm:text-sm font-light text-muted-foreground">
//               <span>{event.attendees} registered</span>
//               <span>{event.maxAttendees} max</span>
//             </div>
//             <div className="w-full h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-secondary transition-all duration-500 rounded-full"
//                 style={{ width: `${progressPercentage}%` }}
//               />
//             </div>
//           </div>
//         )}

//         {/* CTA Button */}
//         <button
//           className={`w-full py-3 sm:py-3.5 md:py-4 rounded-lg font-light tracking-wide transition-all duration-300 text-sm sm:text-base md:text-lg ${
//             event.status === "upcoming"
//               ? "bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
//               : "bg-muted text-muted-foreground cursor-default"
//           }`}
//           disabled={event.status === "past"}
//         >
//           {event.status === "upcoming" ? "Register Now" : "View Details"}
//         </button>
//       </div>
//     </div>
//   );
// }