export const fadeIn = (direction: string, delay: number) => {
	return {
		hidden: {
			y: direction === 'up' ? 150 : direction === 'down' ? 150 : 0,
			x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
		},
		show: {
			y: 0,
			x: 0,
			opacity: 1,
			transition: {
				type: 'tween',
				duration: 1,
				delay: delay,
				ease: [0.25, 0.25, 0.25, 0.25],
			},
		},
		exit: {
			opacity: 0,
			y: 50,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
	};
};

export const fadeUp = (delay: number) => {
	return {
		hidden: {
			opacity: 0,
			y: 100,
			scale: 0.5,
		},
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.5,
				delay: delay,
				ease: 'easeInOut',
			},
		},
		exit: {
			opacity: 0,
			y: 50,
			transition: {
				duration: 0.2,
				ease: 'easeInOut',
			},
		},
	};
};