import DeleteIcon from '@mui/icons-material/Delete';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import {
	Box,
	Button,
	Checkbox,
	Fade,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Toolbar,
	Tooltip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Moment from 'react-moment';
import { NoticeStatus } from '../../../enums/notice.enum';
import { Notice } from '../../../types/notice/notice';

type Order = 'asc' | 'desc';

interface Data {
	category: string;
	title: string;
	id: string;
	writer: string;
	date: string;
	view: number;
	action: string;
}
interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	// {
	// 	id: 'id',
	// 	numeric: true,
	// 	disablePadding: false,
	// 	label: 'ID',
	// },
	// {
	// 	id: 'writer',
	// 	numeric: true,
	// 	disablePadding: false,
	// 	label: 'WRITER',
	// },
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	// {
	// 	id: 'view',
	// 	numeric: true,
	// 	disablePadding: false,
	// 	label: 'VIEW',
	// },
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
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

interface EnhancedTableToolbarProps {
	dense?: boolean;
	notices: Notice[];
	membersData?: any;
	searchMembers?: any;
	removeNoticeHandler: any;
	updateNoticeHandler: any;
	anchorEl?: any;
	menuIconClickHandler: any;
	handleMenuIconClick?: any;
	menuIconCloseHandler?: any;
	generateMentorTypeHandle?: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const [select, setSelect] = useState('');
	const {
		onSelectAllClick,
		order,
		orderBy,
		notices,
		numSelected,
		rowCount,
		onRequestSort,
		removeNoticeHandler,
		menuIconClickHandler,
		updateNoticeHandler,
		menuIconCloseHandler,
		anchorEl,
	} = props;

	return (
		<>
			{numSelected > 0 ? (
				<>
					<Toolbar>
						<Box component={'div'}>
							<Box component={'div'} className="flex_box">
								<Checkbox
									color="primary"
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={onSelectAllClick}
									inputProps={{
										'aria-label': 'select all',
									}}
								/>
								<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="h6" component="div">
									{numSelected} selected
								</Typography>
							</Box>
							<Button variant={'text'} size={'large'}>
								Delete
							</Button>
						</Box>
					</Toolbar>
				</>
			) : (
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
						</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								align={headCell.numeric ? 'left' : 'right'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
							>
								{headCell.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
			)}
			{numSelected > 0 ? null : null}
		</>
	);
};

interface NoticeListType {
	dense?: boolean;
	membersData?: any;
	searchMembers?: any;
	updateNoticeHandler: any;
	anchorEl?: any;
	removeNoticeHandler: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	menuIconClickHandler: any;
	generateMentorTypeHandle?: any;
	menuIconCloseHandler?: any;
	notices: Notice[];
}

export const NoticeList = (props: NoticeListType) => {
	const {
		dense,
		membersData,
		searchMembers,
		anchorEl,
		notices,
		removeNoticeHandler,
		handleMenuIconClick,
		menuIconClickHandler,
		menuIconCloseHandler,
		updateNoticeHandler,
		handleMenuIconClose,
		generateMentorTypeHandle,
	} = props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableToolbar />
					<TableBody>
						{notices.map((notice: Notice, index: number) => {
							const member_image = '/img/profile/defaultUser.svg';

							return (
								<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{notice.noticeCategory}</TableCell>
									<TableCell align="left">
										<Box component={'div'}>
											{notice.noticeTitle}
											{notice.noticeStatus === NoticeStatus.ACTIVE && (
												<Link
													href={`/community/detail?articleCategory=${notice.noticeCategory}&id=${notice._id}`}
													className={'img_box'}
												>
													<IconButton className="btn_window">
														<Tooltip title={'Open window'}>
															<OpenInBrowserRoundedIcon />
														</Tooltip>
													</IconButton>
												</Link>
											)}
										</Box>
									</TableCell>
									<TableCell align="left">{notice.noticeContent}</TableCell>
									<TableCell align="left" className={'name'}>
										<Stack direction={'row'}>
											<Link href={`/faq/detail?id=${notice?._id}`}>
												<Moment format={'DD.MM.YY HH:mm'}>{notice?.createdAt}</Moment>
											</Link>
										</Stack>
									</TableCell>

									<TableCell align="center">
										<TableCell align="center">
											{notice.noticeStatus === NoticeStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{
														p: '3px',
														border: 'none',
														':hover': { border: '1px solid #000000' },
													}}
													onClick={() => removeNoticeHandler(notice?._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{notice.noticeStatus === NoticeStatus.HOLD && (
												<Button className={'badge warning'}>{notice.noticeStatus}</Button>
											)}

											{notice.noticeStatus === NoticeStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{notice.noticeStatus}
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
														{Object.values(NoticeStatus)
															.filter((ele) => ele !== notice.noticeStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() =>
																		updateNoticeHandler({
																			_id: notice._id,
																			noticeStatus: status,
																		})
																	}
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
