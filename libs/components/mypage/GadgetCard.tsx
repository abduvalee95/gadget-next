import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Moment from 'react-moment';
import { GadgetStatus } from '../../enums/gadget.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Gadget } from '../../types/gadget/gadget';
import { formatterStr } from '../../utils';

interface GadgetCardProps {
	gadget: Gadget;
	deleteGadgetHandler?: any;
	memberPage?: boolean;
	updateGadgetHandler?: any;
}

export const GadgetCard = (props: GadgetCardProps) => {
	const { gadget, deleteGadgetHandler, memberPage, updateGadgetHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditGadget = async (id: string) => {
		console.log('+pushEditGadget: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addGadget', gadgetId: id },
		});
	};

	const pushGadgetDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/gadget/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE GADGET CARD</div>;
	} else
		return (
			<Stack className="gadget-card-box">
				<Stack className="image-box" onClick={() => pushGadgetDetail(gadget?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${gadget.gadgetImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushGadgetDetail(gadget?._id)}>
					<Typography className="name">{gadget.gadgetTitle}</Typography>
					<Typography className="address">{gadget.gadgetColor}</Typography>
					<Typography className="price">
						<strong>${formatterStr(gadget?.gadgetPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{gadget.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{gadget.gadgetStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && gadget.gadgetStatus !== 'SOLD' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{gadget.gadgetStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updateGadgetHandler(GadgetStatus.SOLD, gadget?._id);
									}}
								>
									Sold
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{gadget.gadgetViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage &&
					gadget.gadgetStatus ===
						GadgetStatus.ACTIVE /* Faqatgina Active Bolgan holatdagina 2ta uttondi render qilsin  */ && (
						<Stack className="action-box">
							<IconButton className="icon-button" onClick={() => pushEditGadget(gadget._id)}>
								<ModeIcon className="buttons" />
							</IconButton>
							<IconButton className="icon-button" onClick={() => deleteGadgetHandler(gadget._id)}>
								<DeleteIcon className="buttons" />
							</IconButton>
						</Stack>
					)}
			</Stack>
		);
};
