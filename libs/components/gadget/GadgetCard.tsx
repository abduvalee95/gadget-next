import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL, topGadgetRank } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Gadget } from '../../types/gadget/gadget';
import { formatterStr } from '../../utils';
import { DriveFolderUploadTwoTone, OutboundTwoTone } from '@mui/icons-material'

interface GadgetCardType {
	gadget: Gadget;
	likeGadgetHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const GadgetCard = (props: GadgetCardType) => {
	const { gadget, likeGadgetHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = gadget?.gadgetImages[0]
		? `${REACT_APP_API_URL}/${gadget?.gadgetImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>GADGET CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/gadget/detail',
							query: { id: gadget?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{gadget && gadget?.gadgetRank > topGadgetRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/gadget/detail',
									query: { id: gadget?._id },
								}}
							>
								<Typography>{gadget.gadgetTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{/* {gadget.gadgetColor}  */}
								{gadget.gadgetLocation}
							</Typography>
						</Stack>
					</Stack>
						<span className={'color'}  ><img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-compare-iphone-14-swatch-202303?wid=216&hei=36&fmt=jpeg&qlt=90&.v=1696362194883" alt="" /></span>
					<Stack className="options">
						<Stack className="option">
						</Stack>
						<Stack className="option">
							<span><DriveFolderUploadTwoTone/></span>
							 <Typography>{gadget.gadgetCapacity} GB</Typography>
						</Stack>
						<Stack className="option">
						{/* 	<img src="/img/icons/expand.svg" alt="" /> <Typography>{gadget.gadgetSquare} </Typography> */}
						</Stack>
					</Stack>
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(gadget?.gadgetPrice)}</Typography>
					</Box>
					<Box component={'div'} className={'buy-box'}>
						<Link  href={''}> <Typography>BUY</Typography></Link>
						<Link href={''}><Typography>Learn More <OutboundTwoTone sx={{fontSize: '15px' }} /></Typography>  </Link>
					</Box>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								// className={gadget.gadgetUsed ? '' : 'disabled-type'}
							>
								USED
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								// className={gadget.gadgetNew ? '' : 'disabled-type'}
							>
								NEW
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
								<IconButton color={'default'} onClick={() => likeGadgetHandler(user, gadget?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : gadget?.meLiked && gadget?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{gadget?.gadgetLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default GadgetCard;
