import { useQuery } from '@apollo/client';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Box, Stack } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { T } from '../../types/common';
import { Gadget } from '../../types/gadget/gadget'
import { GadgetsInquiry } from '../../types/gadget/gadget.input'
import { GET_PROPERTIES } from '../../../apollo/user/query'
import PopularGadgetCard from './PopularGadgetCard'

interface PopularGadgetsProps {
	initialInput: GadgetsInquiry;
}

const PopularGadgets = (props: PopularGadgetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularGadgets, setPopularGadgets] = useState<Gadget[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getGadgetsLoading,
		data: getGadgetsData,
		error: getGadgetsError,
		refetch: getGadgetsRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularGadgets(data?.getGadgets?.list);
		},
	});
	/** HANDLERS **/

	if (!popularGadgets) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular gadgets</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularGadgets.map((gadget: Gadget) => {
								return (
									<SwiperSlide key={gadget._id} className={'popular-gadget-slide'}>
										<PopularGadgetCard gadget={gadget} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular gadgets</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/gadget'}>
									<span>Compare all models</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularGadgets.map((gadget: Gadget) => {
								return (
									<SwiperSlide key={gadget._id} className={'popular-property-slide'}>
										<PopularGadgetCard gadget={gadget} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularGadgets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'gadgetViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularGadgets;
