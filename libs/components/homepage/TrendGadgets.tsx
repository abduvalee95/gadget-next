import { useMutation, useQuery } from '@apollo/client';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import {  Box, Paper, Stack, } from '@mui/material';
import { useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import TrendGadgetCard from './TrendGadgetCard';
import { GadgetsInquiry } from '../../types/gadget/gadget.input'
import { Gadget } from '../../types/gadget/gadget'
import { GET_PROPERTIES } from '../../../apollo/user/query'

interface TrendGadgetsProps {
	initialInput: GadgetsInquiry;
}

const TrendGadgets = (props: TrendGadgetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendGadgets, setTrendGadgets] = useState<Gadget[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetGadget] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getGadgetsLoading,
		data: getGadgetsData, // data cachelanyabti
		error: getGadgetsError,
		refetch: getGadgetsRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendGadgets(data?.getGadgets?.list); //malum bir malumotlarni saqlash uchun  suniy malumotlarni
		},
	});
	/** HANDLERS **/
	const likeGadgetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED); // Agar Login bomagan bolsa
			//todo: Execute liketargetGadget

			await likeTargetGadget({ variables: { input: id } }); //apolloda cache bor

			//todo: Execute getGadgetRefetch .. ohirgi malumotni ackenddan talab qilib olish Refetch qilib olamiz

			await getGadgetsRefetch({ input: initialInput }); //Bu logic ishg atushganda eng ohirgi malumot birmarta qurilib oladi

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (error: any) {
			console.log('ERROR , LikeTrendGadget:', error.message);
			sweetMixinErrorAlert(error.message).then();
		}
	};

	if (trendGadgets) console.log('trendGadgets:', trendGadgets);
	if (!trendGadgets) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Gadgets</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendGadgets.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendGadgets.map((gadget: Gadget) => {
									return (
										<SwiperSlide key={gadget._id} className={'trend-property-slide'}>
											<TrendGadgetCard gadget={gadget} likeGadgetHandler={likeGadgetHandler} />{' '}
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Best Gadgets On You'r Hand </span>
							<p>Explore the lineup</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendGadgets.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={35}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendGadgets.map((gadget: Gadget) => {
									return (
										<SwiperSlide key={gadget._id} className={'trend-property-slide'}>
											<TrendGadgetCard gadget={gadget} likeGadgetHandler={likeGadgetHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
						
	}
};

TrendGadgets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'gadgetLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendGadgets;
