import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'WVDC 2024 Apple',
		city: 'Apple Park',
		description:
			'Introducing Apple Intelligence, AI for the rest of us. And exciting updates coming with iOS 18, iPadOS 18, macOS Sequoia, watchOS 11, and visionOS 2.0 !',
		imageSrc: '/img/events/appleevent.jpg',
	},
	{
		eventTitle: 'Experience a whole new 837',
		city: 'Seoul',
		description: 'We’re always creating new ways for you to experience our technology. Keep tabs on upcoming events, from workshops to screenings to cultural moments!',
		imageSrc: '/img/events/Samsungt.jpg',
	},
	{
		eventTitle: 'Xiaomi HyperOS',
		city: 'Daegu',
		description: 'A human-centric operating system designed for the "Human x Car x Home" smart ecosystem',
		imageSrc: '/img/events/xiaomi1.webp',
	},
	{
		eventTitle: 'Xiaomi MWC 2024',
		city: 'Barcelona',
		description:
			'Welcome to Human X Car X Home !',
		imageSrc: '/img/events/xiaomi.webp',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.city}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>The latest. Take a look at what’s new, right now</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
