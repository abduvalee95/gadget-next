import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	Fade,
	Menu,
	MenuItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';
import { REACT_APP_API_URL } from '../../../config';
import { GadgetStatus } from '../../../enums/gadget.enum';
import { Gadget } from '../../../types/gadget/gadget';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, gadget: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface GadgetPanelListType {
	gadgets: Gadget[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateGadgetHandler: any;
	removeGadgetHandler: any;
}

export const GadgetPanelList = (props: GadgetPanelListType) => {
	const {
		gadgets,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateGadgetHandler,
		removeGadgetHandler,
	} = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{gadgets.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{gadgets.length !== 0 &&
							gadgets.map((gadget: Gadget, index: number) => {
								const gadgetImage = `${REACT_APP_API_URL}/${gadget?.gadgetImages[0]}`;

								return (
									<TableRow hover key={gadget?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{gadget._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{gadget.gadgetStatus === GadgetStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/gadget/detail?id=${gadget?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={gadgetImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/gadget/detail?id=${gadget?._id}`}>
														<div>{gadget.gadgetTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={gadgetImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{gadget.gadgetTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{gadget.gadgetPrice}</TableCell>
										<TableCell align="center">{gadget.memberData?.memberNick}</TableCell>
										<TableCell align="center">{gadget.gadgetLocation}</TableCell>
										<TableCell align="center">{gadget.gadgetType}</TableCell>
										<TableCell align="center">
											{gadget.gadgetStatus === GadgetStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removeGadgetHandler(gadget._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{gadget.gadgetStatus === GadgetStatus.SOLD && (
												<Button className={'badge warning'}>{gadget.gadgetStatus}</Button>
											)}

											{gadget.gadgetStatus === GadgetStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{gadget.gadgetStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(GadgetStatus)
															.filter((ele) => ele !== gadget.gadgetStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateGadgetHandler({ _id: gadget._id, gadgetStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
