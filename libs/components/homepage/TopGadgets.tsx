import { useMutation, useQuery } from '@apollo/client';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { Message } from '../../enums/common.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import { Gadget } from '../../types/gadget/gadget'
import { GadgetsInquiry } from '../../types/gadget/gadget.input'
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation'
import TopGadgetCard from './TopGadgetCard'

interface TopGadgetsProps {
	initialInput: GadgetsInquiry;
}

const TopGadgets = (props: TopGadgetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topGadgets, setTopGadgets] = useState<Gadget[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetGadget] = useMutation(LIKE_TARGET_PROPERTY);

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
			setTopGadgets(data?.getGadgets?.list);
		},
	});
	/** HANDLERS **/

	const likeGadgetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetGadget({ variables: { input: id } });

			await getGadgetsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (error: any) {
			console.log('Error, LikeTopGadgets:', error.message);
			sweetMixinErrorAlert(error.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Best gadgets For You</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topGadgets.map((gadget: Gadget) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={gadget?._id}>
										<TopGadgetCard gadget={gadget} likeGadgetHandler={likeGadgetHandler} />
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
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Shop all latest offers</span>
							<p> & innovations</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topGadgets.map((gadget: Gadget) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={gadget?._id}>
										<TopGadgetCard gadget={gadget} likeGadgetHandler={likeGadgetHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopGadgets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'gadgetRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopGadgets;
