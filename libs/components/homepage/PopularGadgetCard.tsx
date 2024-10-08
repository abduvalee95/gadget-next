import { useReactiveVar } from '@apollo/client';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Divider, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL, topGadgetRank} from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Gadget } from '../../types/gadget/gadget'
import Link from 'next/link'

interface PopularGadgetCardProps {
	gadget: Gadget;
}

const PopularGadgetCard = (props: PopularGadgetCardProps) => {
	const { gadget } = props;
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
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${gadget?.gadgetImages[0]})` }}
					onClick={() => {
						pushDetailHandler(gadget._id);
					}}
				>
					{gadget && gadget?.gadgetRank >= topGadgetRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${gadget.gadgetPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(gadget._id);
						}}
					>
					<Typography>{gadget.gadgetTitle}</Typography>	
					</strong>
					<p className={'desc'}>{gadget.gadgetColor}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />

						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{gadget?.gadgetCapacity} GB</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />

						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						{/* <p>{gadget?.gadgetRent ? 'rent' : 'sale'}</p> */}
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${gadget?.gadgetImages[0]})` }}
					onClick={() => {
						pushDetailHandler(gadget._id);
					}}
				>
					{gadget && gadget?.gadgetRank >= topGadgetRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>Top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${gadget.gadgetPrice}</div>
					<Link href={''} className={'buy'} >Buy</Link> 
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(gadget._id);
						}}
					>
						<Typography>{gadget.gadgetTitle}</Typography>
					</strong>
					<p className={'desc'}>{gadget.gadgetColor}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{gadget?.gadgetWeight} </span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{gadget?.gadgetCapacity} GB</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							{/* <span>{gadget?.gadgetSquare} inch</span> */}
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						{/* <p>{gadget?.gadgetRent ? 'rent' : 'sale'}</p> */}
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{gadget?.gadgetViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularGadgetCard;
