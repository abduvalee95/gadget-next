import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Divider, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL, topGadgetRank } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Gadget } from '../../types/gadget/gadget';
import { formatterStr } from '../../utils';

interface GadgetBigCardProps {
	gadget: Gadget;
	likeGadgetHandler: any;
}

const GadgetBigCard = (props: GadgetBigCardProps) => {
	const { gadget, likeGadgetHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar); // usevar orqalik biz authenticate bolganmizmi yoki yoqmi tekshirish logicni hosil qiladi
	const router = useRouter();

	/** HANDLERS **/
	const goGadgetDetatilPage = (gadgetId: string) => {
		router.push(`/gadget/detail?id=${gadgetId}`);
	};

	if (device === 'mobile') {
		return <div>Gadget BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goGadgetDetatilPage(gadget?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${gadget?.gadgetImages?.[0]})` }}
				>
					{gadget && gadget?.gadgetRank >= topGadgetRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(gadget?.gadgetPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{gadget?.gadgetTitle}</strong>
					<p className={'desc'}>{gadget?.gadgetColor}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							{/* <span>{gadget?.gadgetBeds} bed</span> */}
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{gadget?.gadgetCapacity} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							{/* <span>{gadget?.gadgetSquare} m2</span>{} */}
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
					{/* 	<div>
							{gadget?.gadgetRent ? <p>Rent</p> : <span>Rent</span>}
							{gadget?.gadgetBarter ? <p>Barter</p> : <span>Barter</span>}
						</div> */}
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e:any) => {
									e.stopPropagation();
									likeGadgetHandler(user, gadget?._id);
								}}
							>
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

export default GadgetBigCard;
