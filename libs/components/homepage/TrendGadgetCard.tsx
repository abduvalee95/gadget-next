import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Divider, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Gadget } from '../../types/gadget/gadget'
import { DriveFolderUploadTwoTone, MemoryOutlined, SmartphoneOutlined } from '@mui/icons-material'


interface TrendGadgetCardProps {
	gadget: Gadget;
	likeGadgetHandler: any;
}

const TrendGadgetCard = (props: TrendGadgetCardProps) => {
	const { gadget, likeGadgetHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (gadgetId: string) => {
		console.log('id', gadgetId);

		await router.push({ pathname: 'gadget/detail', query: { id: gadgetId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={gadget._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${gadget?.gadgetImages[0]})` }}
					onClick={() => {
						pushDetailHandler(gadget._id);
					}}
				>
					<div>${gadget.gadgetPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(gadget._id);
						}}
					>
						{gadget.gadgetTitle}
					</strong>
					<p className={'desc'}>{gadget.gadgetDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{gadget.gadgetWeight} Wide</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{gadget.gadgetCapacity} GB</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							{/* <span>{gadget.gadgetSquare} inch</span> */}
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						{/* <p>
							{gadget.gadgetRent ? 'Rent' : ''} {gadget.gadgetRent && gadget.gadgetBarter && '/'}{' '}
							{gadget.gadgetBarter ? 'Barter' : ''}
						</p> */}
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
							<IconButton color={'default'} onClick={() => likeGadgetHandler(user, gadget._id)}>
								{gadget?.meLiked && gadget?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={gadget._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${gadget?.gadgetImages[0]})` }}
					onClick={() => {
						pushDetailHandler(gadget._id);
					}}
				>
					<div>${gadget.gadgetPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(gadget._id);
						}}
					>
						{gadget.gadgetTitle}
					</strong>
					<p className={'desc'}>{gadget.gadgetDesc ?? 'no description'}</p>
					<div>	<span className={'color'} ><img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-compare-iphone-14-swatch-202303?wid=216&hei=36&fmt=jpeg&qlt=90&.v=1696362194883" alt="" /></span>	</div>
					<div className={'options'}>
						<div>

						<span><SmartphoneOutlined/></span>
							<span>{gadget.gadgetWeight}mg</span>
						</div>
						<div>
							<span><DriveFolderUploadTwoTone/></span>
							<span>{gadget.gadgetCapacity} GB</span>
						</div>
						<div>
							{/* <span>{gadget.gadgetSquare} display</span> */}
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						{/* <p>
							{gadget.gadgetRent ? 'Rent' : ''} {gadget.gadgetRent && gadget.gadgetBarter && '/'}{' '}
							{gadget.gadgetBarter ? 'Barter' : ''}
						</p> */}
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
							<IconButton color={'default'} onClick={() => likeGadgetHandler(user, gadget._id)}>
								{gadget?.meLiked && gadget?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendGadgetCard;
