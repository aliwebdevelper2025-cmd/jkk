import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SlideItem {
  id: number;
  photo: string;
  position: string;
  titleLines: string[];
  titleClass: 'standard' | 'explore';
  captionTitle: string;
  captionDesc: string;
  thumbIndex: number; // 0 = top (tuk-tuk), 1 = middle (floating market), 2 = bottom (Wat Arun)
}

interface ThumbItem {
  id: number;
  slideIndex: number;
  label: string;
  image: string;
}

interface PropertyItem {
  id: string;
  name: string;
  area: string;
  district: string;
  price: number;
  priceFormatted: string;
  rating: string;
  photo700: string;
  photo1400: string;
  type: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 0,
    photo:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005348_d02f5076-330a-4062-960b-b000a310d6e4.png&w=2400&q=85',
    position: 'center 62%',
    titleLines: ['WELCOME TO BANGKOK'],
    titleClass: 'standard',
    captionTitle: 'Discover Bangkok',
    captionDesc:
      "Discover Bangkok's best places to stay and visit. Find suitable ones for you and your family",
    thumbIndex: 2,
  },
  {
    id: 1,
    photo:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_2a7781a6-ffd1-48f1-bb19-051b67063047.png&w=2400&q=85',
    position: 'center 55%',
    titleLines: ['FIND PLACE TO STAY'],
    titleClass: 'standard',
    captionTitle: 'Places to stay',
    captionDesc:
      'Riverside teak houses, sky-high suites and quiet garden villas picked for you',
    thumbIndex: 1,
  },
  {
    id: 2,
    photo:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_73725010-6ca6-46d8-a732-fc33275a02e0.png&w=2400&q=85',
    position: 'center 40%',
    titleLines: ['EXPLORE', 'BANGKOK'],
    titleClass: 'explore',
    captionTitle: 'Places to go',
    captionDesc: "Explore through the eyes of Bangkok's best Thai adventures",
    thumbIndex: 0,
  },
];

const THUMBNAILS: ThumbItem[] = [
  {
    id: 0,
    slideIndex: 2,
    label: 'Tuk-tuk street adventure',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_2697af01-b81b-4c9e-bb4f-7200cb1aa1e8.png&w=400&q=85',
  },
  {
    id: 1,
    slideIndex: 1,
    label: 'Floating market',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_e2768ec3-714b-47bc-b03e-4fc6794d5dd9.png&w=400&q=85',
  },
  {
    id: 2,
    slideIndex: 0,
    label: 'Wat Arun with longtail boat',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_c5667173-fd6e-4dcb-9547-6c4518e19388.png&w=400&q=85',
  },
];

const CLOUD_IMAGE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005635_6590354a-216c-40a2-9f84-93abe97dc7b1.png&w=2400&q=85';

const PROPERTIES: PropertyItem[] = [
  {
    id: 'riverside-teak-villa',
    name: 'Riverside Teak Villa',
    area: 'Khlong San, Bangkok',
    district: 'Khlong San',
    price: 1300,
    priceFormatted: '$1,300',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_d7535a9a-29c3-4714-9c2a-4b8934ed1df2.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005347_d7535a9a-29c3-4714-9c2a-4b8934ed1df2.png&w=1400&q=85',
  },
  {
    id: 'baan-suan-teak-house',
    name: 'Baan Suan Teak House',
    area: 'Thonburi, Bangkok',
    district: 'Thonburi',
    price: 1200,
    priceFormatted: '$1,200',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005405_6867b7fa-e6ec-4c5c-a810-aea29a94cce4.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005405_6867b7fa-e6ec-4c5c-a810-aea29a94cce4.png&w=1400&q=85',
  },
  {
    id: 'sathorn-sky-condo',
    name: 'Sathorn Sky Condo',
    area: 'Sathorn, Bangkok',
    district: 'Sathorn',
    price: 170,
    priceFormatted: '$170',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_78f07613-5823-4ef1-94a9-cbf8977e5c38.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_78f07613-5823-4ef1-94a9-cbf8977e5c38.png&w=1400&q=85',
  },
  {
    id: 'velvet-night-suite',
    name: 'Velvet Night Suite',
    area: 'Silom, Bangkok',
    district: 'Silom',
    price: 120,
    priceFormatted: '$120',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_816e6775-3733-4270-8e1f-bbf270fe3fff.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_816e6775-3733-4270-8e1f-bbf270fe3fff.png&w=1400&q=85',
  },
  {
    id: 'lantern-deck-house',
    name: 'Lantern Deck House',
    area: 'Bang Rak, Bangkok',
    district: 'Bang Rak',
    price: 70,
    priceFormatted: '$70',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_bf9bfa74-cb9c-4055-a632-b725670fdc9d.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005408_bf9bfa74-cb9c-4055-a632-b725670fdc9d.png&w=1400&q=85',
  },
  {
    id: 'skyline-pool-cabana',
    name: 'Skyline Pool Cabana',
    area: 'Sukhumvit, Bangkok',
    district: 'Sukhumvit',
    price: 105,
    priceFormatted: '$105',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005413_84e12590-d5b2-4676-9600-c31c6cd0b0f4.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005413_84e12590-d5b2-4676-9600-c31c6cd0b0f4.png&w=1400&q=85',
  },
  {
    id: 'grand-river-residence',
    name: 'Grand River Residence',
    area: 'Charoen Krung, Bangkok',
    district: 'Charoen Krung',
    price: 1300,
    priceFormatted: '$1,300',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005414_da006178-018e-4ed8-b340-f6a70f18f1bc.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005414_da006178-018e-4ed8-b340-f6a70f18f1bc.png&w=1400&q=85',
  },
  {
    id: 'palm-court-resort',
    name: 'Palm Court Resort',
    area: 'Bang Na, Bangkok',
    district: 'Bang Na',
    price: 1200,
    priceFormatted: '$1,200',
    rating: '4,8',
    type: 'Villas',
    photo700:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005417_3c7632ad-341c-4e40-b370-db3c3aaf479e.png&w=700&q=85',
    photo1400:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005417_3c7632ad-341c-4e40-b370-db3c3aaf479e.png&w=1400&q=85',
  },
];

const INTERIOR_THUMBS = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005420_531ca3bc-da2a-48a8-9506-30b46f6725a5.png&w=500&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005422_3d48e291-6d44-46fa-a18e-ab2f7c791839.png&w=500&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005426_0b8053b2-b0af-4629-85b1-5800d8f100d0.png&w=500&q=85',
];

const AVATARS = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005635_2bc44540-0fec-4b94-9f47-722c00c851dd.png&w=120&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005635_fee8e948-a5dc-4e86-9ecc-dc8dbce6b660.png&w=120&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261115_005635_ce259660-2765-42ee-a5b0-3afee70b11aa.png&w=120&q=85',
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(min: number, val: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMonthDayYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/* Thin-line SVG icons matching exact stroke delicacy */
const ChevronDownIcon = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 4.5L6 8l3.5-3.5" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19" />
    <path d="M12 2.5a14.5 14.5 0 0 1 0 19 14.5 14.5 0 0 1 0-19z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M1 2h12M1 6h12M1 10h12" />
  </svg>
);

const UserSilhouetteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.87 0-8 1.94-8 5v2h16v-2c0-3.06-4.13-5-8-5z" />
  </svg>
);

const PinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 1 1 13 0c0 5.2-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

const CalendarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 9.5h17" />
  </svg>
);

const PeopleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9.5" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c0-3 2.7-5 6-5s6 2 6 5" />
    <circle cx="16.5" cy="9.5" r="2.5" />
    <path d="M16.5 14.5c2.5 0 4.5 1.5 4.5 4.2" />
  </svg>
);

const PaperPlaneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 3L10 14" />
    <path d="M21 3l-6.5 18-4-7.5L3 9.5 21 3z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill={filled ? '#ff4d5e' : 'none'}
    stroke={filled ? '#ff4d5e' : '#1d1a1c'}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = ({ color, size = 12 }: { color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.2l2.92 6.18 6.8.89-4.98 4.72 1.25 6.74L12 17.46l-5.99 3.27 1.25-6.74-4.98-4.72 6.8-.89L12 2.2z" />
  </svg>
);

/* Amenity icons */
const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="19.5" r="1" fill="currentColor" />
  </svg>
);

const BarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l-6 8.5L6 3z" />
    <path d="M12 11.5V21" />
    <path d="M8 21h8" />
  </svg>
);

const PierIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17c2.5 1.5 5 1.5 7.5 0s5-1.5 7.5 0 2.5 1 3 .5" />
    <path d="M4 11h16" />
    <path d="M7 7v8M12 7v8M17 7v8" />
  </svg>
);

const SuperhostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5.5" />
    <path d="M8.5 14l-1.5 7 5-2.8 5 2.8-1.5-7" />
  </svg>
);

const CinemaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
    <path d="M10 9.5l5 2.5-5 2.5v-5z" />
  </svg>
);

const RoomServiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18h18" />
    <path d="M5 18a7 7 0 0 1 14 0" />
    <path d="M12 8V11" />
    <path d="M10 8h4" />
  </svg>
);

interface StayCardProps {
  property: PropertyItem;
  index: number;
  isLiked: boolean;
  popping: boolean;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onSelect: (property: PropertyItem, rect: DOMRect) => void;
  immediate?: boolean;
}

const StayCard: React.FC<StayCardProps> = ({
  property,
  index,
  isLiked,
  popping,
  onToggleLike,
  onSelect,
  immediate = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setInView(true);
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const handleClick = () => {
    const rect = photoRef.current?.getBoundingClientRect() || cardRef.current?.getBoundingClientRect();
    if (rect) {
      onSelect(property, rect);
    }
  };

  const staggerMs = (index % 4) * 90;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      data-clickable="true"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        aspectRatio: '203 / 268',
        borderRadius: '12px',
        boxShadow: '0 12px 30px rgba(110, 60, 50, .16)',
        transitionDelay: inView && !immediate ? `${staggerMs}ms` : '0ms',
      }}
      className={`stay-card group relative overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-[#1d1a1c] ${
        inView ? 'is-inview' : ''
      }`}
    >
      <div ref={photoRef} className="absolute inset-0 overflow-hidden rounded-[12px]">
        <img
          src={property.photo700}
          alt={`${property.name} in ${property.area}`}
          referrerPolicy="no-referrer"
          className="stay-card-img h-full w-full object-cover"
          loading="eager"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,12,14,0.04) 0%, rgba(20,12,14,0) 40%, rgba(20,12,14,0.34) 68%, rgba(20,12,14,0.82) 100%)',
          }}
        />
      </div>

      {/* Top-left price pill */}
      <div
        className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11.5px] font-semibold tracking-tight text-[#1d1a1c]"
        style={{
          backgroundColor: 'rgba(255, 255, 255, .82)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRadius: '6px',
        }}
      >
        <span className="tabular-nums">{property.priceFormatted}</span>
        <span style={{ opacity: 0.6 }}>/night</span>
      </div>

      {/* Top-right heart button */}
      <button
        type="button"
        aria-label={isLiked ? `Remove ${property.name} from favorites` : `Save ${property.name}`}
        data-clickable="true"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(property.id, e);
        }}
        className={`absolute top-3 right-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 ${
          popping ? 'heart-pop' : ''
        }`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, .92)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, .14)',
        }}
      >
        <HeartIcon filled={isLiked} />
      </button>

      {/* Bottom-left text */}
      <div className="pointer-events-none absolute right-3.5 bottom-3.5 left-3.5 z-10 text-white">
        <div className="truncate text-[15.5px] font-semibold leading-snug tracking-tight">
          {property.name}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[11.5px] text-white/85">
          <PinIcon size={12} />
          <span className="truncate">{property.area}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((s) => (
              <StarIcon key={s} color="#f7c325" size={11.5} />
            ))}
          </div>
          <span className="text-[11.5px] font-medium tabular-nums text-white/95">
            {property.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  /* Viewport measurements for exact rail math */
  const [viewport, setViewport] = useState(() => ({
    vw: typeof window !== 'undefined' ? window.innerWidth : 1440,
    vh: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));

  useEffect(() => {
    const onResize = () => {
      setViewport({ vw: window.innerWidth, vh: window.innerHeight });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Intro & Hero state */
  const [introTitlesReady, setIntroTitlesReady] = useState(false);
  const [introThumbsReady, setIntroThumbsReady] = useState(false);
  const [introRingsReady, setIntroRingsReady] = useState(false);
  const [introSearchReady, setIntroSearchReady] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setIntroTitlesReady(true), 250);
    const t2 = window.setTimeout(() => setIntroThumbsReady(true), 350);
    const t3 = window.setTimeout(() => setIntroRingsReady(true), 400);
    const t4 = window.setTimeout(() => setIntroSearchReady(true), 300);
    const t5 = window.setTimeout(() => setCaptionVisible(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, []);

  /* Slide & Misty Wipe state */
  const [activeSlide, setActiveSlide] = useState(0);
  const [outgoingSlide, setOutgoingSlide] = useState<number | null>(null);
  const [wipeProgress, setWipeProgress] = useState(1);
  const activeSlideRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const wipeRafRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const captionTimerRef = useRef<number | null>(null);

  /* Live Ken Burns + pointer parallax on active slide */
  const liveSlideStartRef = useRef<number>(performance.now());
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const livePhotoElRef = useRef<HTMLDivElement | null>(null);
  const outgoingPhotoElRef = useRef<HTMLDivElement | null>(null);

  const startSlideTransition = useCallback((nextIdx: number) => {
    if (nextIdx === activeSlideRef.current) return;
    if (wipeRafRef.current) cancelAnimationFrame(wipeRafRef.current);
    if (captionTimerRef.current) window.clearTimeout(captionTimerRef.current);

    const prevIdx = activeSlideRef.current;
    activeSlideRef.current = nextIdx;
    isTransitioningRef.current = true;
    liveSlideStartRef.current = performance.now();

    setOutgoingSlide(prevIdx);
    setActiveSlide(nextIdx);
    setWipeProgress(0);
    setCaptionVisible(false);

    captionTimerRef.current = window.setTimeout(() => {
      setCaptionVisible(true);
    }, 650);

    const startTime = performance.now();
    const duration = 1250;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - startTime) / duration);
      const p = easeInOutCubic(raw);
      setWipeProgress(p);

      if (raw < 1) {
        wipeRafRef.current = requestAnimationFrame(tick);
      } else {
        isTransitioningRef.current = false;
        setOutgoingSlide(null);
        setWipeProgress(1);
        liveSlideStartRef.current = performance.now();
      }
    };
    wipeRafRef.current = requestAnimationFrame(tick);
  }, []);

  const scheduleAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
    autoTimerRef.current = window.setInterval(() => {
      const next = (activeSlideRef.current + 1) % SLIDES.length;
      startSlideTransition(next);
    }, 5200);
  }, [startSlideTransition]);

  useEffect(() => {
    scheduleAutoAdvance();
    return () => {
      if (autoTimerRef.current) window.clearInterval(autoTimerRef.current);
      if (wipeRafRef.current) cancelAnimationFrame(wipeRafRef.current);
      if (captionTimerRef.current) window.clearTimeout(captionTimerRef.current);
    };
  }, [scheduleAutoAdvance]);

  const handleThumbClick = (slideIdx: number) => {
    if (slideIdx === activeSlideRef.current) return;
    startSlideTransition(slideIdx);
    scheduleAutoAdvance();
  };

  /* Continuous Ken Burns + Parallax loop */
  useEffect(() => {
    let rafId = 0;
    const loop = (now: number) => {
      if (!isTransitioningRef.current && livePhotoElRef.current) {
        const elapsedSec = Math.min(12, (now - liveSlideStartRef.current) / 1000);
        const kbScale = 1.04 + elapsedSec * 0.0035;
        const px = parallaxRef.current.x * 0.6;
        const py = parallaxRef.current.y * 0.5;
        livePhotoElRef.current.style.transform = `translate3d(${px}%, ${py}%, 0) scale(${kbScale})`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* Scroll choreography + Nav solid state */
  const [navSolid, setNavSolid] = useState(false);
  const slideStackRef = useRef<HTMLDivElement>(null);
  const bottomCloudRef = useRef<HTMLDivElement>(null);
  const topCloudRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      ticking = false;
      const sy = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 900;
      setNavSolid(sy > vh * 0.3);

      if (slideStackRef.current) {
        slideStackRef.current.style.transform = `translate3d(0, ${sy * 0.42}px, 0)`;
      }
      if (bottomCloudRef.current) {
        const scale = 1 + (0.35 * sy) / vh;
        bottomCloudRef.current.style.transform = `translate3d(0, ${-sy * 0.38}px, 0) scale(${scale})`;
      }
      if (topCloudRef.current) {
        const op = Math.min(1, sy / (0.45 * vh));
        topCloudRef.current.style.opacity = `${op}`;
        topCloudRef.current.style.transform = `translate3d(0, ${-sy * 0.16}px, 0)`;
      }
      if (railRef.current) {
        const op = Math.max(0, 1 - sy / (0.5 * vh));
        railRef.current.style.opacity = `${op}`;
        railRef.current.style.transform = `translate3d(0, ${sy * 0.2}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Custom cursor */
  const cursorRef = useRef<HTMLDivElement>(null);
  const isRecMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('rec');
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const isClickable = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest('a, button, [role="button"], [data-clickable="true"], input, select')
      );
    };

    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.classList.add('is-visible');
      if (isClickable(e.target)) {
        el.classList.add('is-hover');
      } else {
        el.classList.remove('is-hover');
      }

      // Pointer parallax normalized -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      parallaxRef.current = { x: -nx, y: -ny };
    };

    const onDown = () => el.classList.add('is-down');
    const onUp = () => el.classList.remove('is-down');
    const onLeave = () => el.classList.remove('is-visible');
    const onTouch = () => el.classList.remove('is-visible');

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  /* Search Bar & Popovers state */
  type SearchField = 'destination' | 'checkin' | 'checkout' | 'visitors' | null;
  const [raisedField, setRaisedField] = useState<SearchField>('checkin');
  const [openPopover, setOpenPopover] = useState<'destination' | 'calendar' | 'visitors' | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Bangkok');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 11, // December 2026 (0-indexed)
  });
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [guestsTouched, setGuestsTouched] = useState<boolean>(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  const totalGuests = adults + children;
  const guestsLabel = guestsTouched
    ? `${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}`
    : 'Add guests';

  const handleDateClick = (dayDate: Date) => {
    if (!checkIn || (checkIn && checkOut) || openPopover === 'calendar' && raisedField === 'checkin') {
      if (checkIn && !checkOut && raisedField === 'checkout') {
        if (dayDate < checkIn) return;
        setCheckOut(dayDate);
        setRaisedField('visitors');
        setOpenPopover('visitors');
        return;
      }
      setCheckIn(dayDate);
      setCheckOut(null);
      setRaisedField('checkout');
    } else {
      if (dayDate < checkIn) return;
      setCheckOut(dayDate);
      setRaisedField('visitors');
      setOpenPopover('visitors');
    }
  };

  /* Calendar days generation (Monday first) */
  const calendarCells = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // JS getDay(): 0 = Sun, 1 = Mon ... 6 = Sat -> convert to Monday-first 0..6
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const cells: Array<{ date: Date | null }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d) });
    }
    return cells;
  }, [calendarMonth]);

  /* Favorites & Pop state */
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [poppingId, setPoppingId] = useState<string | null>(null);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setPoppingId(id);
    window.setTimeout(() => {
      setPoppingId((cur) => (cur === id ? null : cur));
    }, 380);
  };

  /* Filter & Stays section */
  const [showAllStays, setShowAllStays] = useState(true);
  const filteredProperties = useMemo(() => {
    if (selectedDistrict === 'All Bangkok' || showAllStays) return PROPERTIES;
    const matches = PROPERTIES.filter((p) => p.district === selectedDistrict);
    return matches.length > 0 ? matches : PROPERTIES;
  }, [selectedDistrict, showAllStays]);

  /* Nav interactive popovers (Visitors / Contact / Host / Account) */
  const [navMenuOpen, setNavMenuOpen] = useState<'visitors' | 'account' | 'contact' | 'host' | null>(null);
  const [hostSubmitted, setHostSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setNavMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, []);

  /* Shared-element Flight & Detail Page state */
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [detailClosing, setDetailClosing] = useState(false);
  const [detailRevealed, setDetailRevealed] = useState(false);
  const [mainImageLanded, setMainImageLanded] = useState(false);
  const [detailMainLoaded1400, setDetailMainLoaded1400] = useState(false);
  const [detailGuests, setDetailGuests] = useState(2);
  const [detailBooked, setDetailBooked] = useState(false);
  const [userRated, setUserRated] = useState<number | null>(null);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [activeInteriorIdx, setActiveInteriorIdx] = useState<number | null>(null);

  const detailMainPhotoRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const [flightState, setFlightState] = useState<{
    photo: string;
    from: DOMRect;
    to: DOMRect;
  } | null>(null);
  const flightElRef = useRef<HTMLDivElement>(null);

  const openPropertyDetail = useCallback(
    (property: PropertyItem, fromRect: DOMRect) => {
      setOpenPopover(null);
      setNavMenuOpen(null);
      setSelectedProperty(property);
      setDetailClosing(false);
      setDetailRevealed(false);
      setMainImageLanded(false);
      setDetailMainLoaded1400(false);
      setDetailBooked(false);
      setUserRated(null);
      setShowRatingPicker(false);
      setActiveInteriorIdx(null);
      setDetailGuests(guestsTouched ? totalGuests : 2);

      // Lock body scroll while detail is open
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0;
        requestAnimationFrame(() => {
          const targetRect = detailMainPhotoRef.current?.getBoundingClientRect();
          if (targetRect) {
            setFlightState({
              photo: property.photo700,
              from: fromRect,
              to: targetRect,
            });
          } else {
            setMainImageLanded(true);
          }
          window.setTimeout(() => {
            setDetailRevealed(true);
          }, 50);
        });
      });
    },
    [guestsTouched, totalGuests]
  );

  useEffect(() => {
    if (!flightState || !flightElRef.current) return;
    const el = flightElRef.current;
    const { from, to } = flightState;

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;

    const anim = el.animate(
      [
        {
          transformOrigin: 'top left',
          transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
          borderRadius: '12px',
        },
        {
          transformOrigin: 'top left',
          transform: 'translate3d(0px, 0px, 0) scale(1, 1)',
          borderRadius: '10px',
        },
      ],
      {
        duration: 900,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      setMainImageLanded(true);
      setFlightState(null);
    };

    return () => {
      anim.cancel();
    };
  }, [flightState]);

  const closeDetailPage = useCallback(() => {
    if (!selectedProperty) return;
    setDetailClosing(true);
    setFlightState(null);
    window.setTimeout(() => {
      setSelectedProperty(null);
      setDetailClosing(false);
      document.body.style.overflow = '';
    }, 520);
  }, [selectedProperty]);

  const scrollToStays = () => {
    setOpenPopover(null);
    const el = document.getElementById('stays-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Right Rail Geometry Math */
  const railGeometry = useMemo(() => {
    const { vw, vh } = viewport;
    const heroH = Math.max(680, vh);
    const activeSize = clamp(96, vw * 0.113, 190);
    const inactiveSize = clamp(46, vw * 0.054, 92);
    const gap = Math.max(8, vw * 0.009);
    const centerX = vw * 0.855;
    const startTop = 74 + heroH * 0.085;

    const activeThumbIdx = SLIDES[activeSlide].thumbIndex;
    let cursorY = startTop;
    const items = THUMBNAILS.map((thumb, idx) => {
      const isActive = idx === activeThumbIdx;
      const size = isActive ? activeSize : inactiveSize;
      const top = cursorY;
      const left = centerX - size / 2;
      cursorY += size + gap;
      return {
        ...thumb,
        isActive,
        size,
        top,
        left,
        centerY: top + size / 2,
      };
    });

    const activeItem = items[activeThumbIdx];
    const innerRadius = activeSize / 2 + vw * 0.05;
    const outerRadius = activeSize / 2 + vw * 0.108;
    const connectorLen = Math.max(40, vw * 0.047);
    const connectorRight = vw - (activeItem.left - vw * 0.008);
    const connectorLeft = activeItem.left - vw * 0.008 - connectorLen;
    const captionRight = vw - (connectorLeft - Math.max(16, vw * 0.014));
    const barHeight = Math.max(84, vw * 0.065);

    return {
      items,
      activeItem,
      centerX,
      innerRadius,
      outerRadius,
      connectorLen,
      connectorRight,
      captionRight,
      barHeight,
    };
  }, [viewport, activeSlide]);

  /* Misty Wipe Mask Strings */
  const wipeMaskStyle = useMemo(() => {
    const p = wipeProgress;
    const start = p * 135 - 35;
    const mid = p * 135 - 17.5;
    const end = p * 135;
    const grad = `linear-gradient(to left, rgba(0,0,0,1) ${start}%, rgba(0,0,0,0.6) ${mid}%, rgba(0,0,0,0) ${end}%)`;
    return {
      maskImage: grad,
      WebkitMaskImage: grad,
    };
  }, [wipeProgress]);

  const mistBandStyle = useMemo(() => {
    const p = wipeProgress;
    const centerPctFromRight = p * 135 - 17.5;
    const opacity = Math.sin(Math.PI * p) * 0.95;
    return {
      right: `${centerPctFromRight - 17}%`,
      opacity,
    };
  }, [wipeProgress]);

  /* Detail page default / selected dates */
  const detailCheckInText = checkIn ? formatMonthDay(checkIn) : 'Dec 22';
  const detailCheckOutText = checkOut ? formatMonthDayYear(checkOut) : 'Dec 27, 2026';
  const similarProperties = useMemo(() => {
    if (!selectedProperty) return PROPERTIES.slice(0, 4);
    return PROPERTIES.filter((p) => p.id !== selectedProperty.id).slice(0, 4);
  }, [selectedProperty]);

  const isNavSolid = navSolid || Boolean(selectedProperty);
  const savedCount = Object.values(likedIds).filter(Boolean).length;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Custom Dot Cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`krung-cursor ${isRecMode ? 'is-rec' : ''}`}
      />

      {/* Fixed Navigation Bar */}
      <header
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-50 flex h-[74px] items-center justify-between transition-all duration-500"
        style={{
          paddingLeft: 'clamp(20px, 9.5vw, 170px)',
          paddingRight: 'clamp(20px, 9.5vw, 170px)',
          backgroundColor: isNavSolid ? 'rgba(247, 217, 198, .86)' : 'transparent',
          backdropFilter: isNavSolid ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: isNavSolid ? 'blur(14px)' : 'none',
          color: isNavSolid ? '#1d1a1c' : 'rgba(255, 255, 255, .92)',
          borderBottom: isNavSolid
            ? '1px solid rgba(29, 26, 28, .08)'
            : '1px solid rgba(255, 255, 255, .28)',
        }}
      >
        {/* Left side: Logo + 1x42 divider + Visitors */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              if (selectedProperty) {
                closeDetailPage();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-[26px] font-light tracking-[-0.01em] whitespace-nowrap shrink-0 transition-opacity hover:opacity-80"
          >
            Krung Travel
          </button>

          <div
            aria-hidden="true"
            className="nav-divider h-[42px] w-[1px] shrink-0"
            style={{
              backgroundColor: 'currentColor',
              opacity: 0.45,
              marginLeft: '28px',
              marginRight: '28px',
            }}
          />

          <button
            type="button"
            onClick={() => setNavMenuOpen(navMenuOpen === 'visitors' ? null : 'visitors')}
            className="nav-visitors flex items-center gap-1.5 text-[12.5px] font-normal whitespace-nowrap shrink-0 transition-opacity hover:opacity-75"
          >
            <span>Visitors</span>
            <ChevronDownIcon size={11} />
          </button>
        </div>

        {/* Center links */}
        <nav className="nav-center-links flex items-center text-[14.5px] font-normal" style={{ gap: '44px' }}>
          <button
            type="button"
            onClick={() => {
              if (selectedProperty) {
                closeDetailPage();
                window.setTimeout(scrollToStays, 540);
              } else {
                scrollToStays();
              }
            }}
            className="nav-wipe-link"
          >
            Apartments
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedProperty) closeDetailPage();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              startSlideTransition(2);
              scheduleAutoAdvance();
            }}
            className="nav-wipe-link"
          >
            Where to go
          </button>
          <button
            type="button"
            onClick={() => setNavMenuOpen(navMenuOpen === 'contact' ? null : 'contact')}
            className="nav-wipe-link"
          >
            Contact Us
          </button>
        </nav>

        {/* Right side: Become a host + Globe + Pill */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            type="button"
            onClick={() => setNavMenuOpen(navMenuOpen === 'host' ? null : 'host')}
            className="nav-host-link text-[14px] font-normal whitespace-nowrap shrink-0 transition-opacity hover:opacity-75"
          >
            Become a host
          </button>

          <button
            type="button"
            aria-label="Language & region"
            onClick={() => setNavMenuOpen(navMenuOpen === 'visitors' ? null : 'visitors')}
            className="flex items-center justify-center transition-opacity hover:opacity-75"
          >
            <GlobeIcon />
          </button>

          <button
            type="button"
            aria-label="Account & menu"
            onClick={() => setNavMenuOpen(navMenuOpen === 'account' ? null : 'account')}
            className="flex items-center gap-2.5 px-2.5 py-1.5 transition-opacity hover:opacity-80"
            style={{
              border: '1.5px solid currentColor',
              borderRadius: '9px',
            }}
          >
            <HamburgerIcon />
            <span
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
              style={{
                backgroundColor: isNavSolid ? '#1d1a1c' : 'rgba(255,255,255,0.92)',
                color: isNavSolid ? '#f7d9c6' : '#5c5156',
              }}
            >
              <UserSilhouetteIcon />
            </span>
          </button>
        </div>

        {/* Clean interactive nav dropdowns */}
        {navMenuOpen && (
          <div
            className="popover-drop fixed top-[84px] right-[clamp(20px,9.5vw,170px)] z-50 w-[300px] rounded-[18px] bg-white p-5 text-[#1d1a1c]"
            style={{ boxShadow: '0 22px 60px rgba(80, 40, 35, .2)' }}
          >
            {navMenuOpen === 'visitors' && (
              <div>
                <div className="font-gilda text-lg">Bangkok Visitor Guide</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#5c5156]">
                  All stays include river-ferry pier tips, English & Thai concierge support, and verified neighborhood hosts.
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[#1d1a1c]/10 pt-3 text-[12.5px] text-[#5c5156]">
                  <span>Currency</span>
                  <span className="font-semibold text-[#1d1a1c]">USD ($) · Bangkok</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNavMenuOpen(null)}
                  className="mt-4 w-full rounded-full bg-[#1d1a1c] py-2 text-[13px] font-medium text-white"
                >
                  Close
                </button>
              </div>
            )}

            {navMenuOpen === 'account' && (
              <div>
                <div className="font-gilda text-lg">Krung Account</div>
                <div className="mt-3 space-y-2 text-[13.5px]">
                  <button
                    type="button"
                    onClick={() => {
                      setNavMenuOpen(null);
                      if (selectedProperty) closeDetailPage();
                      window.setTimeout(scrollToStays, 200);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#fbe7da]/60"
                  >
                    <span>Saved places</span>
                    <span className="font-semibold tabular-nums">{savedCount}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNavMenuOpen('host');
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#fbe7da]/60"
                  >
                    <span>List your Bangkok home</span>
                    <span>→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNavMenuOpen('contact')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-[#fbe7da]/60"
                  >
                    <span>Concierge support</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {navMenuOpen === 'host' && (
              <div>
                <div className="font-gilda text-lg">Become a Host</div>
                {hostSubmitted ? (
                  <p className="mt-2 text-[13px] text-[#16a34a]">
                    Thank you — our Bangkok curation team will reach out within 24 hours.
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setHostSubmitted(true);
                    }}
                    className="mt-3 space-y-2.5"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Property neighborhood (e.g., Thonburi)"
                      className="w-full rounded-xl border border-[#1d1a1c]/15 px-3 py-2 text-[13px] outline-none focus:border-[#1d1a1c]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your email"
                      className="w-full rounded-xl border border-[#1d1a1c]/15 px-3 py-2 text-[13px] outline-none focus:border-[#1d1a1c]"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#f39419] py-2 text-[13px] font-semibold text-white"
                    >
                      Submit Property
                    </button>
                  </form>
                )}
              </div>
            )}

            {navMenuOpen === 'contact' && (
              <div>
                <div className="font-gilda text-lg">Contact Krung Travel</div>
                {contactSubmitted ? (
                  <p className="mt-2 text-[13px] text-[#16a34a]">
                    Message received. Our local Bangkok desk replies shortly.
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="mt-3 space-y-2.5"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      className="w-full rounded-xl border border-[#1d1a1c]/15 px-3 py-2 text-[13px] outline-none focus:border-[#1d1a1c]"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Ask about river villas or bespoke trips..."
                      className="w-full resize-none rounded-xl border border-[#1d1a1c]/15 px-3 py-2 text-[13px] outline-none focus:border-[#1d1a1c]"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#1d1a1c] py-2 text-[13px] font-semibold text-white"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
        {/* Parallax Slide Stack */}
        <div ref={slideStackRef} className="absolute inset-0 will-change-transform">
          {/* Outgoing Slide (when wiping) */}
          {outgoingSlide !== null && (
            <div
              key={`out-${outgoingSlide}`}
              className="absolute inset-0 z-[2] overflow-hidden"
            >
              <div
                ref={outgoingPhotoElRef}
                className="absolute will-change-transform"
                style={{
                  inset: '-3%',
                  backgroundImage: `url("${SLIDES[outgoingSlide].photo}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: SLIDES[outgoingSlide].position,
                  transform: `translate3d(${-2 * wipeProgress}%, 0, 0) scale(${
                    1.04 + 0.05 * wipeProgress
                  })`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(84,64,74,.42) 0%, rgba(84,64,74,.08) 26%, transparent 46%)',
                }}
              />
              <HeroTitle
                slide={SLIDES[outgoingSlide]}
                revealed={true}
              />
            </div>
          )}

          {/* Active / Incoming Slide */}
          <div
            key={`active-${activeSlide}`}
            className="absolute inset-0 z-[3] overflow-hidden"
            style={outgoingSlide !== null ? wipeMaskStyle : undefined}
          >
            <div
              ref={livePhotoElRef}
              className="absolute will-change-transform"
              style={{
                inset: '-3%',
                backgroundImage: `url("${SLIDES[activeSlide].photo}")`,
                backgroundSize: 'cover',
                backgroundPosition: SLIDES[activeSlide].position,
                transform:
                  outgoingSlide !== null
                    ? `translate3d(${2 * (1 - wipeProgress)}%, 0, 0) scale(${
                        1.12 - 0.08 * wipeProgress
                      })`
                    : 'scale(1.04)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(84,64,74,.42) 0%, rgba(84,64,74,.08) 26%, transparent 46%)',
              }}
            />
            <HeroTitle
              slide={SLIDES[activeSlide]}
              revealed={introTitlesReady}
            />
          </div>

          {/* Soft Misty Wipe Edge Band */}
          {outgoingSlide !== null && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 z-[5] w-[34vw]"
              style={{
                ...mistBandStyle,
                background:
                  'radial-gradient(ellipse at center, rgba(255, 236, 226, .75) 0%, rgba(255, 236, 226, .35) 45%, transparent 72%)',
                filter: 'blur(10px)',
              }}
            />
          )}
        </div>

        {/* Bottom Volumetric Cloud Bank (Screen-blended, masked top edge) */}
        <div
          ref={bottomCloudRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-[7] will-change-transform"
          style={{
            left: '-4%',
            right: '-4%',
            bottom: '-6%',
            height: '78%',
            mixBlendMode: 'screen',
          }}
        >
          {/* Back cloud copy */}
          <div
            className="cloud-back absolute inset-0"
            style={{
              opacity: 0.85,
              backgroundImage: `url("${CLOUD_IMAGE}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              maskImage: 'linear-gradient(180deg, transparent 0%, black 38%, black 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 38%, black 100%)',
            }}
          />
          {/* Front cloud copy */}
          <div
            className="cloud-front absolute inset-0"
            style={{
              backgroundImage: `url("${CLOUD_IMAGE}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              maskImage: 'linear-gradient(180deg, transparent 0%, black 38%, black 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 38%, black 100%)',
            }}
          />
        </div>

        {/* Top Cloud Layer (Vertically flipped, fades in on scroll) */}
        <div
          ref={topCloudRef}
          aria-hidden="true"
          className="pointer-events-none absolute z-[8] will-change-transform"
          style={{
            left: '-4%',
            right: '-4%',
            top: '-30%',
            height: '80%',
            opacity: 0,
            mixBlendMode: 'screen',
            maskImage: 'linear-gradient(0deg, transparent 0%, black 42%, black 100%)',
            WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, black 42%, black 100%)',
          }}
        >
          <div
            className="h-full w-full"
            style={{
              transform: 'scaleY(-1)',
              backgroundImage: `url("${CLOUD_IMAGE}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
            }}
          />
        </div>

        {/* Bottom Peach Fade Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-[9] h-[46%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(247,217,198,0) 0%, rgba(247,217,198,.45) 45%, rgba(247,217,198,.92) 82%, #f7d9c6 100%)',
          }}
        />

        {/* Right Rail: Thumbnails, Concentric Rings, Connector, Caption */}
        <div
          ref={railRef}
          className="pointer-events-none absolute inset-0 z-[12] will-change-transform"
        >
          {/* Inner Concentric Ring */}
          <div
            style={{
              position: 'absolute',
              top: railGeometry.activeItem.centerY - railGeometry.innerRadius,
              left: railGeometry.centerX - railGeometry.innerRadius,
              width: railGeometry.innerRadius * 2,
              height: railGeometry.innerRadius * 2,
              borderRadius: '50%',
              border: '1.6px solid rgba(255, 255, 255, .5)',
              opacity: introRingsReady ? 1 : 0,
              transition:
                'top .9s var(--ease), left .9s var(--ease), width .9s var(--ease), height .9s var(--ease), opacity .9s var(--out)',
            }}
          />

          {/* Outer Concentric Ring */}
          <div
            style={{
              position: 'absolute',
              top: railGeometry.activeItem.centerY - railGeometry.outerRadius,
              left: railGeometry.centerX - railGeometry.outerRadius,
              width: railGeometry.outerRadius * 2,
              height: railGeometry.outerRadius * 2,
              borderRadius: '50%',
              border: '1.6px solid rgba(255, 255, 255, .5)',
              opacity: introRingsReady ? 1 : 0,
              transition:
                'top .9s var(--ease), left .9s var(--ease), width .9s var(--ease), height .9s var(--ease), opacity 1.1s var(--out)',
            }}
          />

          {/* Active Thumbnail Halo Ring (9px outside active thumbnail) */}
          <div
            style={{
              position: 'absolute',
              top: railGeometry.activeItem.top - 9,
              left: railGeometry.activeItem.left - 9,
              width: railGeometry.activeItem.size + 18,
              height: railGeometry.activeItem.size + 18,
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, .55)',
              opacity: introThumbsReady ? 1 : 0,
              transition:
                'top .9s var(--ease), left .9s var(--ease), width .9s var(--ease), height .9s var(--ease), opacity .6s var(--out)',
            }}
          />

          {/* Horizontal Connector Line */}
          <div
            className="hero-connector-wrap"
            style={{
              position: 'absolute',
              top: railGeometry.activeItem.centerY - 1.5,
              right: railGeometry.connectorRight,
              width: railGeometry.connectorLen,
              height: '3px',
              transition: 'top .9s var(--ease), right .9s var(--ease)',
            }}
          >
            <div
              className={`connector-line h-full w-full rounded-full bg-white ${
                captionVisible ? 'is-shown' : ''
              }`}
            />
          </div>

          {/* Caption Block */}
          <div
            className="hero-caption-wrap flex items-center gap-4"
            style={{
              position: 'absolute',
              top: railGeometry.activeItem.centerY,
              right: railGeometry.captionRight,
              transform: 'translateY(-50%)',
              transition: 'top .9s var(--ease), right .9s var(--ease)',
            }}
          >
            <div className={`caption-text-clip text-right text-white ${captionVisible ? 'is-shown' : ''}`}>
              <h2
                className="font-light tracking-[-0.01em] whitespace-nowrap"
                style={{
                  fontSize: 'clamp(26px, 2.75vw, 40px)',
                  textShadow: '0 4px 20px rgba(40, 20, 25, .28)',
                }}
              >
                {SLIDES[activeSlide].captionTitle}
              </h2>
              <p
                className="ml-auto mt-1.5 leading-snug"
                style={{
                  fontSize: 'clamp(12px, 1vw, 14.5px)',
                  color: 'rgba(255, 255, 255, .88)',
                  maxWidth: '250px',
                  textShadow: '0 2px 12px rgba(40, 20, 25, .25)',
                }}
              >
                {SLIDES[activeSlide].captionDesc}
              </p>
            </div>

            {/* 3px White Vertical Bar */}
            <div
              className={`caption-bar w-[3px] rounded-full bg-white ${
                captionVisible ? 'is-shown' : ''
              }`}
              style={{ height: railGeometry.barHeight }}
            />
          </div>

          {/* 3 Round Destination Thumbnails */}
          {railGeometry.items.map((thumb, idx) => (
            <button
              key={thumb.id}
              type="button"
              aria-label={thumb.label}
              data-clickable="true"
              onClick={() => handleThumbClick(thumb.slideIndex)}
              className="pointer-events-auto group overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                position: 'absolute',
                top: thumb.top,
                left: thumb.left,
                width: thumb.size,
                height: thumb.size,
                border: '3px solid rgba(255, 255, 255, .92)',
                boxShadow: '0 10px 26px rgba(60, 30, 30, .28)',
                transform: introThumbsReady ? 'scale(1)' : 'scale(0)',
                transition: `top .9s var(--ease), left .9s var(--ease), width .9s var(--ease), height .9s var(--ease), transform .75s var(--out) ${
                  introThumbsReady ? idx * 140 : 0
                }ms, box-shadow .35s var(--out)`,
              }}
            >
              <img
                src={thumb.image}
                alt={thumb.label}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div
          ref={searchWrapRef}
          className="absolute left-1/2 z-[20] -translate-x-1/2"
          style={{
            width: 'min(900px, calc(100% - 40px))',
            bottom: viewport.vw <= 640 ? '16vh' : 'calc(20vh + 2px)',
            opacity: introSearchReady ? 1 : 0,
            transform: introSearchReady ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s var(--out), transform 1s var(--out)',
          }}
        >
          <div
            className="flex flex-col sm:flex-row sm:h-[90px] items-stretch sm:items-center justify-between gap-2 sm:gap-1 p-2.5 sm:px-3 sm:py-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, .93)',
              borderRadius: '26px',
              boxShadow: '0 18px 60px rgba(120, 70, 60, .16)',
            }}
          >
            {/* Fields Container (2x2 grid on <=640px, flex row on >640px) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-1 items-center gap-1.5 sm:gap-1">
              {/* 1. Bangkok (1.35x wider) */}
              <button
                type="button"
                data-clickable="true"
                onMouseEnter={() => setRaisedField('destination')}
                onClick={() => {
                  setRaisedField('destination');
                  setOpenPopover(openPopover === 'destination' ? null : 'destination');
                }}
                className="flex h-[64px] sm:h-[72px] items-center gap-3 px-4 text-left transition-all duration-200 sm:flex-[1.35]"
                style={{
                  borderRadius: '14px',
                  backgroundColor:
                    raisedField === 'destination' || openPopover === 'destination'
                      ? '#ffffff'
                      : 'transparent',
                  boxShadow:
                    raisedField === 'destination' || openPopover === 'destination'
                      ? '0 8px 24px rgba(120, 80, 70, .14)'
                      : 'none',
                }}
              >
                <span className="shrink-0 text-[#1d1a1c]/80">
                  <PinIcon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[21px] font-medium leading-tight text-[#1d1a1c]">
                    {selectedDistrict === 'All Bangkok' ? 'Bangkok' : selectedDistrict}
                  </div>
                  <div className="truncate text-[12px] sm:text-[13px] text-[#8a7f83]">
                    Choose the destination
                  </div>
                </div>
              </button>

              {/* 2. Check in */}
              <button
                type="button"
                data-clickable="true"
                onMouseEnter={() => setRaisedField('checkin')}
                onClick={() => {
                  setRaisedField('checkin');
                  setOpenPopover('calendar');
                }}
                className="flex h-[64px] sm:h-[72px] items-center gap-3 px-4 text-left transition-all duration-200 sm:flex-1"
                style={{
                  borderRadius: '14px',
                  backgroundColor:
                    raisedField === 'checkin' ? '#ffffff' : 'transparent',
                  boxShadow:
                    raisedField === 'checkin'
                      ? '0 8px 24px rgba(120, 80, 70, .14)'
                      : 'none',
                }}
              >
                <span className="shrink-0 text-[#1d1a1c]/80">
                  <CalendarIcon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[21px] font-medium leading-tight text-[#1d1a1c]">
                    Check in
                  </div>
                  <div className="truncate text-[12px] sm:text-[13px] text-[#8a7f83]">
                    {checkIn ? formatMonthDay(checkIn) : 'Add date'}
                  </div>
                </div>
              </button>

              {/* 3. Check out */}
              <button
                type="button"
                data-clickable="true"
                onMouseEnter={() => setRaisedField('checkout')}
                onClick={() => {
                  setRaisedField('checkout');
                  setOpenPopover('calendar');
                }}
                className="flex h-[64px] sm:h-[72px] items-center gap-3 px-4 text-left transition-all duration-200 sm:flex-1"
                style={{
                  borderRadius: '14px',
                  backgroundColor:
                    raisedField === 'checkout' ? '#ffffff' : 'transparent',
                  boxShadow:
                    raisedField === 'checkout'
                      ? '0 8px 24px rgba(120, 80, 70, .14)'
                      : 'none',
                }}
              >
                <span className="shrink-0 text-[#1d1a1c]/80">
                  <CalendarIcon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[21px] font-medium leading-tight text-[#1d1a1c]">
                    Check out
                  </div>
                  <div className="truncate text-[12px] sm:text-[13px] text-[#8a7f83]">
                    {checkOut ? formatMonthDay(checkOut) : 'Add date'}
                  </div>
                </div>
              </button>

              {/* 4. Visitors */}
              <button
                type="button"
                data-clickable="true"
                onMouseEnter={() => setRaisedField('visitors')}
                onClick={() => {
                  setRaisedField('visitors');
                  setOpenPopover(openPopover === 'visitors' ? null : 'visitors');
                }}
                className="flex h-[64px] sm:h-[72px] items-center gap-3 px-4 text-left transition-all duration-200 sm:flex-1"
                style={{
                  borderRadius: '14px',
                  backgroundColor:
                    raisedField === 'visitors' || openPopover === 'visitors'
                      ? '#ffffff'
                      : 'transparent',
                  boxShadow:
                    raisedField === 'visitors' || openPopover === 'visitors'
                      ? '0 8px 24px rgba(120, 80, 70, .14)'
                      : 'none',
                }}
              >
                <span className="shrink-0 text-[#1d1a1c]/80">
                  <PeopleIcon size={16} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[17px] sm:text-[21px] font-medium leading-tight text-[#1d1a1c]">
                    Visitors
                  </div>
                  <div className="truncate text-[12px] sm:text-[13px] text-[#8a7f83]">
                    {guestsLabel}
                  </div>
                </div>
              </button>
            </div>

            {/* Black Paper-plane Send Button */}
            <button
              type="button"
              aria-label="Search Bangkok stays"
              data-clickable="true"
              onClick={scrollToStays}
              className="group flex h-[44px] sm:h-[40px] w-full sm:w-[40px] shrink-0 items-center justify-center bg-[#1d1a1c] text-white sm:mr-2.5 transition-transform duration-200 hover:scale-110 hover:rotate-[-8deg]"
              style={{ borderRadius: '11px' }}
            >
              <PaperPlaneIcon />
            </button>
          </div>

          {/* Destination Popover */}
          {openPopover === 'destination' && (
            <div
              className="popover-drop absolute top-[calc(100%+12px)] left-0 z-30 w-[260px] bg-white p-4"
              style={{
                borderRadius: '18px',
                boxShadow: '0 22px 60px rgba(80, 40, 35, .2)',
              }}
            >
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#8a7f83]">
                Bangkok Neighborhoods
              </div>
              <div className="grid grid-cols-1 gap-1">
                {[
                  'All Bangkok',
                  'Khlong San',
                  'Thonburi',
                  'Sathorn',
                  'Silom',
                  'Bang Rak',
                  'Sukhumvit',
                  'Charoen Krung',
                  'Bang Na',
                ].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      setSelectedDistrict(area);
                      setShowAllStays(area === 'All Bangkok');
                      setOpenPopover('calendar');
                      setRaisedField('checkin');
                    }}
                    className={`rounded-xl px-3 py-1.5 text-left text-[13.5px] transition-colors ${
                      selectedDistrict === area
                        ? 'bg-[#1d1a1c] font-medium text-white'
                        : 'text-[#1d1a1c] hover:bg-[#fbe7da]/70'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Popover */}
          {openPopover === 'calendar' && (
            <div
              className="popover-drop absolute top-[calc(100%+12px)] left-1/2 z-30 w-[290px] -translate-x-1/2 bg-white p-5"
              style={{
                borderRadius: '18px',
                boxShadow: '0 24px 64px rgba(80, 40, 35, .2)',
              }}
            >
              {/* Month Header */}
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() =>
                    setCalendarMonth(({ year, month }) =>
                      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] text-[#1d1a1c] hover:bg-[#fbe7da]"
                >
                  ‹
                </button>
                <div className="text-[14.5px] font-semibold text-[#1d1a1c]">
                  {MONTH_NAMES[calendarMonth.month]} {calendarMonth.year}
                </div>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setCalendarMonth(({ year, month }) =>
                      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] text-[#1d1a1c] hover:bg-[#fbe7da]"
                >
                  ›
                </button>
              </div>

              {/* Weekday Headers (Monday first) */}
              <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-[#8a7f83]">
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className="py-1">
                    {wd}
                  </div>
                ))}
              </div>

              {/* 7-column x 34px Grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {calendarCells.map((cell, idx) => {
                  if (!cell.date) return <div key={`empty-${idx}`} className="h-[34px]" />;
                  const d = cell.date;
                  const isStart = isSameDay(d, checkIn);
                  const isEnd = isSameDay(d, checkOut);
                  const inRange = Boolean(checkIn && checkOut && d > checkIn && d < checkOut);
                  const isDisabled = Boolean(
                    checkIn && !checkOut && raisedField === 'checkout' && d < checkIn
                  );

                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleDateClick(d)}
                      className={`relative flex h-[34px] items-center justify-center text-[13px] tabular-nums transition-colors ${
                        isDisabled
                          ? 'text-[#8a7f83]/40'
                          : isStart || isEnd
                          ? 'rounded-[9px] bg-[#1d1a1c] font-semibold text-white'
                          : inRange
                          ? 'bg-[#f7d9c6]/60 text-[#1d1a1c]'
                          : 'rounded-[9px] text-[#1d1a1c] hover:bg-[#fbe7da]'
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visitors Popover */}
          {openPopover === 'visitors' && (
            <div
              className="popover-drop absolute top-[calc(100%+12px)] right-0 z-30 w-[275px] bg-white p-5"
              style={{
                borderRadius: '18px',
                boxShadow: '0 24px 64px rgba(80, 40, 35, .2)',
              }}
            >
              {/* Adults */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-[14.5px] font-semibold text-[#1d1a1c]">Adults</div>
                  <div className="text-[12px] text-[#8a7f83]">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease adults"
                    onClick={() => {
                      setGuestsTouched(true);
                      setAdults((a) => Math.max(1, a - 1));
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-[14px] font-medium tabular-nums">
                    {adults}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase adults"
                    onClick={() => {
                      setGuestsTouched(true);
                      setAdults((a) => Math.min(12, a + 1));
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="my-1.5 h-[1px] bg-[#1d1a1c]/10" />

              {/* Children */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-[14.5px] font-semibold text-[#1d1a1c]">Children</div>
                  <div className="text-[12px] text-[#8a7f83]">Ages 2–12</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease children"
                    onClick={() => {
                      setGuestsTouched(true);
                      setChildren((c) => Math.max(0, c - 1));
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-[14px] font-medium tabular-nums">
                    {children}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase children"
                    onClick={() => {
                      setGuestsTouched(true);
                      setChildren((c) => Math.min(8, c + 1));
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* "Recomended Places to Stay" SECTION */}
      <section
        id="stays-section"
        className="relative z-[15] pb-24"
        style={{
          marginTop: viewport.vw <= 640 ? '-8vh' : '-17vh',
          paddingLeft: 'clamp(20px, 9.5vw, 170px)',
          paddingRight: 'clamp(20px, 9.5vw, 170px)',
        }}
      >
        <div className="mb-7 flex items-center justify-between gap-4">
          <h2
            className="font-gilda font-normal text-[#1d1a1c]"
            style={{ fontSize: 'clamp(26px, 2.45vw, 36px)' }}
          >
            Recomended Places to Stay
          </h2>

          <button
            type="button"
            data-clickable="true"
            onClick={() => {
              setSelectedDistrict('All Bangkok');
              setShowAllStays(true);
            }}
            className="px-6 py-2 text-[13.5px] font-medium text-[#1d1a1c] whitespace-nowrap shrink-0 transition-colors duration-300 hover:bg-[#1d1a1c] hover:text-white"
            style={{
              border: '1.4px solid #1d1a1c',
              borderRadius: '20px',
            }}
          >
            See All
          </button>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: 'clamp(14px, 2.2vw, 30px)' }}
        >
          {filteredProperties.map((property, index) => (
            <StayCard
              key={property.id}
              property={property}
              index={index}
              isLiked={Boolean(likedIds[property.id])}
              popping={poppingId === property.id}
              onToggleLike={toggleLike}
              onSelect={openPropertyDetail}
            />
          ))}
        </div>
      </section>

      {/* SHARED-ELEMENT FLIGHT OVERLAY */}
      {flightState && (
        <div
          ref={flightElRef}
          aria-hidden="true"
          className="pointer-events-none fixed z-[60] overflow-hidden"
          style={{
            top: flightState.to.top,
            left: flightState.to.left,
            width: flightState.to.width,
            height: flightState.to.height,
            borderRadius: '10px',
          }}
        >
          <img
            src={flightState.photo}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* DETAIL PAGE OVERLAY */}
      {selectedProperty && (
        <div
          ref={detailScrollRef}
          className="fixed inset-0 z-40 overflow-y-auto bg-white transition-opacity duration-[550ms]"
          style={{
            opacity: detailClosing ? 0 : 1,
          }}
        >
          {/* 290px Peach Band at Top */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 left-0 h-[290px]"
            style={{ backgroundColor: '#f7d9c6' }}
          />

          <div
            className="relative z-10 pb-24"
            style={{
              paddingTop: '104px',
              paddingLeft: 'clamp(20px, 9.5vw, 170px)',
              paddingRight: 'clamp(20px, 9.5vw, 170px)',
            }}
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className={`detail-reveal mb-7 flex flex-wrap items-center gap-2 text-[12.5px] text-[#1d1a1c] ${
                detailRevealed ? 'is-shown' : ''
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <button
                type="button"
                onClick={closeDetailPage}
                className="font-medium hover:underline"
              >
                Home
              </button>
              <span className="text-[#8a7f83]">›</span>
              <span>Type of places to stay</span>
              <span className="text-[#8a7f83]">›</span>
              <span>{selectedProperty.type}</span>
              <span className="text-[#8a7f83]">›</span>
              <span className="text-[#8a7f83]">
                {selectedProperty.name}, {selectedProperty.area}
              </span>
            </nav>

            {/* Two Columns: 1.18fr and 1fr (stacks <= 1000px) */}
            <div
              className="grid grid-cols-1 lg:grid-cols-[1.18fr_1fr] items-start"
              style={{ gap: 'clamp(28px, 4vw, 56px)' }}
            >
              {/* Left Column */}
              <div>
                {/* Main Photo (aspect 512:445, radius 10px) */}
                <div
                  ref={detailMainPhotoRef}
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '512 / 445',
                    borderRadius: '10px',
                    opacity: mainImageLanded ? 1 : 0,
                  }}
                >
                  {/* Cached w=700 base */}
                  <img
                    src={
                      activeInteriorIdx !== null
                        ? INTERIOR_THUMBS[activeInteriorIdx]
                        : selectedProperty.photo700
                    }
                    alt={`${selectedProperty.name} main view`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {/* High-res w=1400 layered on top */}
                  {activeInteriorIdx === null && (
                    <img
                      src={selectedProperty.photo1400}
                      alt={`${selectedProperty.name} high-resolution view`}
                      referrerPolicy="no-referrer"
                      onLoad={() => setDetailMainLoaded1400(true)}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                      style={{ opacity: detailMainLoaded1400 ? 1 : 0 }}
                    />
                  )}

                  {/* Heart button */}
                  <button
                    type="button"
                    aria-label="Save property"
                    data-clickable="true"
                    onClick={(e) => toggleLike(selectedProperty.id, e)}
                    className={`absolute top-4 right-4 z-10 flex h-[34px] w-[34px] items-center justify-center rounded-full transition-transform hover:scale-105 ${
                      poppingId === selectedProperty.id ? 'heart-pop' : ''
                    }`}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, .92)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, .14)',
                    }}
                  >
                    <HeartIcon filled={Boolean(likedIds[selectedProperty.id])} />
                  </button>
                </div>

                {/* 3 Square Interior Thumbnails */}
                <div
                  className={`detail-reveal mt-4 grid grid-cols-3 gap-4 ${
                    detailRevealed ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '320ms' }}
                >
                  {INTERIOR_THUMBS.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      data-clickable="true"
                      onClick={() =>
                        setActiveInteriorIdx(activeInteriorIdx === i ? null : i)
                      }
                      className="group relative aspect-square overflow-hidden rounded-[10px] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={src}
                        alt={`${selectedProperty.name} interior ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {i === 2 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1d1a1c]/55 text-[22px] font-medium text-white">
                          +9
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Property Name */}
                <h1
                  className={`detail-reveal font-gilda text-[38px] font-normal leading-tight text-[#1d1a1c] ${
                    detailRevealed ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '250ms' }}
                >
                  {selectedProperty.name}
                </h1>

                {/* Host */}
                <div
                  className={`detail-reveal mt-2.5 flex items-center gap-2 text-[13.5px] text-[#5c5156] ${
                    detailRevealed ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '320ms' }}
                >
                  <span>Hosted by</span>
                  <img
                    src={AVATARS[0]}
                    alt="Ploy Sirikul"
                    referrerPolicy="no-referrer"
                    className="h-[20px] w-[20px] rounded-full object-cover"
                  />
                  <span className="font-medium text-[#1d1a1c]">Ploy Sirikul</span>
                </div>

                {/* About */}
                <div
                  className={`detail-reveal mt-7 ${detailRevealed ? 'is-shown' : ''}`}
                  style={{ transitionDelay: '390ms' }}
                >
                  <h2 className="font-gilda text-[22px] font-normal text-[#1d1a1c]">
                    About {selectedProperty.name}
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#5c5156]">
                    Set along the quieter canals of Thonburi across from the Grand Palace and Wat Arun, this sanctuary pairs hand-carved Thai teak interiors with breezy riverfront living. Morning longtail ferries glide directly toward Chinatown street food stalls before returning to a lantern-lit teak terrace overlooking the Chao Phraya sunset.
                  </p>
                </div>

                {/* Booking Card */}
                <div
                  className={`detail-reveal mt-6 bg-white p-6 ${
                    detailRevealed ? 'is-shown' : ''
                  }`}
                  style={{
                    borderRadius: '18px',
                    boxShadow: '0 16px 46px rgba(100, 60, 50, .12)',
                    transitionDelay: '460ms',
                  }}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-[26px] font-semibold tabular-nums text-[#1d1a1c]">
                      {selectedProperty.priceFormatted}
                    </span>
                    <span className="text-[14px] text-[#8a7f83]">/night</span>
                  </div>

                  {/* Pale grey Check In / Check Out box */}
                  <div
                    className="mt-4 grid grid-cols-2 divide-x divide-[#1d1a1c]/10 p-3.5"
                    style={{
                      backgroundColor: '#f6f4f5',
                      borderRadius: '12px',
                    }}
                  >
                    <div className="pr-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#8a7f83]">
                        Check In
                      </div>
                      <div className="mt-0.5 text-[14px] font-medium text-[#1d1a1c]">
                        {detailCheckInText}
                      </div>
                    </div>
                    <div className="pl-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#8a7f83]">
                        Check Out
                      </div>
                      <div className="mt-0.5 text-[14px] font-medium text-[#1d1a1c]">
                        {detailCheckOutText}
                      </div>
                    </div>
                  </div>

                  {/* Guests row with steppers */}
                  <div className="mt-4 flex items-center justify-between px-1">
                    <div>
                      <div className="text-[13.5px] font-medium text-[#1d1a1c]">Guests</div>
                      <div className="text-[12px] text-[#8a7f83]">
                        {detailGuests} {detailGuests === 1 ? 'visitor' : 'visitors'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Decrease guests"
                        onClick={() => setDetailGuests((g) => Math.max(1, g - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-[14px] font-medium tabular-nums">
                        {detailGuests}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase guests"
                        onClick={() => setDetailGuests((g) => Math.min(12, g + 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1d1a1c]/25 text-[15px] text-[#1d1a1c] transition-colors hover:border-[#1d1a1c]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Book Now pill */}
                  <button
                    type="button"
                    data-clickable="true"
                    onClick={() => setDetailBooked(true)}
                    className="mt-5 w-full rounded-full py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:opacity-95"
                    style={{
                      backgroundColor: detailBooked ? '#16a34a' : '#f39419',
                    }}
                  >
                    {detailBooked ? 'Booked ✓' : 'Book Now'}
                  </button>
                </div>

                {/* Rating row between hairlines */}
                <div
                  className={`detail-reveal mt-7 border-t border-b border-[#1d1a1c]/10 py-4 ${
                    detailRevealed ? 'is-shown' : ''
                  }`}
                  style={{ transitionDelay: '530ms' }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[20px] font-semibold tabular-nums text-[#1d1a1c]">
                          4.8
                        </span>
                        <span className="text-[13px] text-[#8a7f83]">
                          ({userRated ? 129 : 128} reviews)
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((s) => (
                          <StarIcon key={s} color="#ff4d5e" size={12} />
                        ))}
                      </div>
                    </div>

                    {/* 3 Overlapping 38px reviewer avatars */}
                    <div className="flex items-center -space-x-2.5">
                      {AVATARS.map((av, idx) => (
                        <img
                          key={av}
                          src={av}
                          alt={`Guest reviewer ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-[38px] w-[38px] rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      data-clickable="true"
                      onClick={() => setShowRatingPicker((v) => !v)}
                      className="rounded-full border border-[#1d1a1c]/30 px-4 py-1.5 text-[13px] font-medium text-[#1d1a1c] transition-colors hover:border-[#1d1a1c] hover:bg-[#1d1a1c] hover:text-white"
                    >
                      {userRated ? `Rated ${userRated}.0 ★` : 'Rate Now'}
                    </button>
                  </div>

                  {showRatingPicker && (
                    <div className="mt-3 flex items-center gap-2 pt-1 text-[13px] text-[#5c5156]">
                      <span>Your rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setUserRated(star);
                            setShowRatingPicker(false);
                          }}
                          className="p-0.5 transition-transform hover:scale-125"
                        >
                          <StarIcon
                            color={userRated && star <= userRated ? '#ff4d5e' : '#d6cdd0'}
                            size={15}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities 3x2 grid */}
                <div
                  className={`detail-reveal mt-7 ${detailRevealed ? 'is-shown' : ''}`}
                  style={{ transitionDelay: '600ms' }}
                >
                  <h3 className="font-gilda text-[20px] font-normal text-[#1d1a1c]">
                    Amenities
                  </h3>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 text-[13.5px] text-[#1d1a1c]">
                    <div className="flex items-center gap-2.5">
                      <WifiIcon />
                      <span>Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BarIcon />
                      <span>Personal Bar</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <PierIcon />
                      <span>Private Pier</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <SuperhostIcon />
                      <span>Superhost</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CinemaIcon />
                      <span>Own Cinema</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <RoomServiceIcon />
                      <span>Room Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Places to Stay */}
            <div
              className={`detail-reveal mt-16 ${detailRevealed ? 'is-shown' : ''}`}
              style={{ transitionDelay: '670ms' }}
            >
              <h2 className="font-gilda mb-6 text-[28px] font-normal text-[#1d1a1c]">
                Similar Places to Stay
              </h2>
              <div
                className="grid grid-cols-2 lg:grid-cols-4"
                style={{ gap: 'clamp(14px, 2.2vw, 30px)' }}
              >
                {similarProperties.map((prop, i) => (
                  <StayCard
                    key={prop.id}
                    property={prop}
                    index={i}
                    immediate={true}
                    isLiked={Boolean(likedIds[prop.id])}
                    popping={poppingId === prop.id}
                    onToggleLike={toggleLike}
                    onSelect={openPropertyDetail}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Hero Giant Gradient-Faded Title Component */
const HeroTitle: React.FC<{ slide: SlideItem; revealed: boolean }> = ({ slide, revealed }) => {
  const isExplore = slide.titleClass === 'explore';

  return (
    <h1
      className="hero-title-el pointer-events-none absolute z-[4] font-bold uppercase select-none"
      style={{
        left: isExplore ? '7vw' : '2.6vw',
        top: isExplore ? 'calc(74px + 5vh)' : 'calc(74px + 3.2vh)',
        fontSize: isExplore ? '9.6vw' : '8.25vw',
        lineHeight: isExplore ? 0.95 : 0.9,
        whiteSpace: 'nowrap',
        letterSpacing: '-0.02em',
      }}
    >
      {slide.titleLines.map((line, lineIdx) => {
        const words = line.split(' ');
        return (
          <span key={lineIdx} className="block">
            {words.map((word, wIdx) => {
              const globalWordIdx = lineIdx * 3 + wIdx;
              return (
                <React.Fragment key={`${lineIdx}-${wIdx}`}>
                  <span className="inline-block overflow-hidden align-top">
                    <span
                      className={`hero-word-text ${revealed ? 'is-revealed' : ''}`}
                      style={{
                        transitionDelay: `${globalWordIdx * 90}ms`,
                      }}
                    >
                      {word}
                    </span>
                  </span>
                  {wIdx < words.length - 1 ? ' ' : ''}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};
