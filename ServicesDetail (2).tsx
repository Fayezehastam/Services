'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useIsomorphicLayoutEffect } from '@app/constants/isomorphicLayout';
import {
	servicesItems,
	servicesItemsTitles,
} from '@app/constants/servicesItems';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Image from 'next/image';
import React from 'react';
import './services.scss';

function ServicesDetail() {
	// State for progress bar value
	const [value, setvalue] = React.useState(16.666);
	const { palette } = useTheme();
	useIsomorphicLayoutEffect(() => {
		gsap.defaults({ overwrite: 'auto' });
		gsap.set('.title1', { color: palette.primary.main });
		const contentSection: any =
			document.getElementsByClassName('content-container');
		// Get #content-container section distance from top
		const elDistanceToTop = contentSection[0].getBoundingClientRect().top;
		// variable for save previous section in services item
		let lastContent: any;
		// Get all titles
		const contentMarkers = gsap.utils.toArray('.contentMarker');
		contentMarkers.forEach((marker: any) => {
			// save contents related to title in title object
			marker.content = document.querySelector(
				`#${marker.dataset.markerContent}`
			);
			gsap.set(marker.content, { transformOrigin: 'center' });
			// Save the function that triggers when we enter in section from top
			marker.content.enterTop = () => {
				gsap.fromTo(
					marker.content,
					{ autoAlpha: 0, y: '100vh' },
					{ duration: 0.8, autoAlpha: 1, y: 0 }
				);
			};
			// Save the function that triggers when we enter in section from down
			marker.content.enterDown = () => {
				gsap.fromTo(
					marker.content,
					{ autoAlpha: 0, y: '-100vh' },
					{ duration: 0.8, autoAlpha: 1, y: 0 }
				);
			};
			// Save the function that triggers when we leave section from top
			marker.content.leaveTop = () => {
				gsap.to(marker.content, { duration: 0.8, autoAlpha: 0, y: '-100vh' });
			};
			// Save the function that triggers when we leave section from down
			marker.content.leaveDown = () => {
				gsap.to(marker.content, { duration: 0.8, autoAlpha: 0, y: '100vh' });
			};
		});
		// Function that triggers in ScrollTrigger onUpdate
		const setProgress = () => {
			// Get what is the number of section we are right now(1-6)(550 is height of each section)
			const newProgress = Math.ceil((scrollY + 550 - elDistanceToTop) / 550);
			setvalue(newProgress * 16.666);
			// Variable for current section we enter
			let newContent: any;

			// Find the current section
			contentMarkers.forEach((marker: any) => {
				if (`text${newProgress}` === marker.content.id) {
					newContent = marker.content;
				}
			});

			// If the current section is different than that last, animate in
			if (
				newContent &&
				(lastContent == null || !newContent.isSameNode(lastContent))
			) {
				// Fade out last section
				const newId = Number(newContent?.id?.replace('text', ''));
				const lastId = lastContent
					? Number(lastContent?.id?.replace('text', ''))
					: 0;
				if (lastContent) {
					// If we enter by scrolling from down triggers leaveDown and reverse
					if (newId > lastId) {
						lastContent.leaveTop();
						gsap.to(`.title${lastId}`, {
							color: palette.text.secondary,
							ease: 'linear',
							duration: 0.5,
						});
					} else {
						lastContent.leaveDown();
						gsap.to(`.title${lastId}`, {
							color: palette.text.secondary,
							ease: 'linear',
							duration: 0.5,
						});
					}
				}
				// Animate in new section
				// If we enter by scrolling from down triggers enterDown and reverse
				if (newId > lastId) {
					newContent.enterTop();
					gsap.to(`.title${newId}`, {
						color: palette.primary.main,
						ease: 'linear',
						duration: 0.5,
					});
				} else {
					newContent.enterDown();
					gsap.to(`.title${newId}`, {
						color: palette.primary.main,
						ease: 'linear',
						duration: 0.5,
					});
				}
				// newContent.enter();

				lastContent = newContent;
			}
		};
		const ST = ScrollTrigger.create({
			trigger: '#ServicesTitle',
			start: 'top top',
			endTrigger: '#AboutUs',
			end: 'top bottom',
			onUpdate: setProgress,
			pin: '.content-container',
			pinSpacing: false,
		});

		const media = window.matchMedia('screen and (max-width: 1199px)');
		ScrollTrigger.addEventListener('refreshInit', checkSTState);
		checkSTState();

		function checkSTState() {
			if (media.matches) {
				ST.disable();
			} else {
				ST.enable();
			}
		}
		return () => {
			ScrollTrigger.removeEventListener('refreshInit', checkSTState);
			ST.disable();
		};
	}, []);

	const scrollToSection = (id: number) => {
		const contentSection: any =
			document.getElementsByClassName('content-container');
		// Get #content-container section distance from top
		const elDistanceToTop = contentSection[0].getBoundingClientRect().top;
		const scrollToTop = (id === 1 ? 264 : 0) + elDistanceToTop + (id + 1) * 550;
		scrollTo({ top: scrollToTop });
	};
	return (
		<Box>
			<Box className="content-container" minHeight={{ lg: '3300px' }}>
				<Box className="right-content" display="flex" gap={{ lg: 6 }}>
					<LinearProgress
						className="progressBar"
						variant="determinate"
						value={value}
					/>
					<Box
						display="flex"
						flexDirection="column"
						gap={{ lg: 4.5 }}
						py={{ lg: 2.25 }}
					>
						{servicesItemsTitles.map(({ id, name, thinName, isThinFirst }) => {
							const isActive = Math.round(value / 16.66) === id;
							return (
								<Typography
									key={id}
									className={`contentMarker title${id}`}
									variant={isActive && !isThinFirst ? 'h3Medium' : 'h3'}
									component="h3"
									color="text.secondary"
									data-marker-content={`text${id}`}
									sx={{ cursor: 'pointer' }}
									onClick={() => scrollToSection(id)}
								>
									{isThinFirst ? thinName : name}{' '}
									<Typography
										component="span"
										variant={isActive && isThinFirst ? 'h3Medium' : 'h3'}
									>
										{!isThinFirst ? thinName : name}
									</Typography>
								</Typography>
							);
						})}
					</Box>
				</Box>
				<Box className="left-content">
					{servicesItems.map(({ id, image, description }) => (
						<Box
							key={id}
							id={`text${id}`}
							display="flex"
							flexDirection="column"
							gap={{ lg: 6 }}
						>
							<Box display="flex" justifyContent="end">
								<Image src={image} alt="bitium" width={284} height={284} />
							</Box>
							<Typography variant="body2" color="text.secondary">
								{description}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}

export default ServicesDetail;
