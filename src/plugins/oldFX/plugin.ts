import { Messager } from '../loader';

export default function init(msg: Messager) {
    msg.on("/home/mounted", () => {
        msg.send("/home/add", `${__dirname}/ui/home`);
    });
    
    // Add tapClicks
    msg.emit("/fx/click/new", "second", 4);
    msg.emit("/fx/click/new", "third", 4);
    msg.emit("/fx/click/new", "fourth", 4);
    msg.emit("/fx/click/new", "fifth", 4);
    msg.emit("/fx/click/new", "sixth", 4);
    msg.emit("/fx/click/new", "seventh", 4);

    // ZCL Alternate White
    msg.emit("/anime/timeline/new", {
        name: "ZCL Alternate",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub71: 1,
                sub72: 0,
                sub73: 0,
                sub74: 0,
                sub75: 0,
                sub76: 1
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub71: 0,
                sub72: 1,
                sub73: 0,
                sub74: 0,
                sub75: 1,
                sub76: 0
            },
            {
                sub71: 0,
                sub72: 0,
                sub73: 1,
                sub74: 1,
                sub75: 0,
                sub76: 0
            },
            {
                sub71: 0,
                sub72: 1,
                sub73: 0,
                sub74: 0,
                sub75: 1,
                sub76: 0
            },
            {
                sub71: 1,
                sub72: 0,
                sub73: 0,
                sub74: 0,
                sub75: 0,
                sub76: 1
            },

        ]
    });

    // ZCL Shutter
    msg.emit("/anime/timeline/new", {
        name: "ZCL Shutter",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub91: 1,
                sub92: 0,
                sub93: 0,
                sub94: 0,
                sub95: 0,
                sub96: 0
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub91: 0,
                sub92: 0,
                sub93: 0,
                sub94: 1,
                sub95: 0,
                sub96: 0
            },
            {
                sub91: 0,
                sub92: 1,
                sub93: 0,
                sub94: 0,
                sub95: 0,
                sub96: 0
            },
            {
                sub91: 0,
                sub92: 0,
                sub93: 0,
                sub94: 0,
                sub95: 1,
                sub96: 0
            },
            {
                sub91: 0,
                sub92: 0,
                sub93: 1,
                sub94: 0,
                sub95: 0,
                sub96: 0
            },
            {
                sub91: 0,
                sub92: 0,
                sub93: 0,
                sub94: 0,
                sub95: 0,
                sub96: 1
            },
            {
                sub91: 1,
                sub92: 0,
                sub93: 0,
                sub94: 0,
                sub95: 0,
                sub96: 0
            }
        ]
    });

    // ZCL Focus
    msg.emit("/anime/timeline/new", {
        name: "ZCL Focus",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub81: 1,
                sub82: 0,
                sub83: 0,
                sub84: 0,
                sub85: 0,
                sub86: 0
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub81: 0,
                sub82: 0,
                sub83: 0,
                sub84: 1,
                sub85: 0,
                sub86: 0
            },
            {
                sub81: 0,
                sub82: 0,
                sub83: 0,
                sub84: 0,
                sub85: 1,
                sub86: 0
            },
            {
                sub81: 0,
                sub82: 1,
                sub83: 0,
                sub84: 0,
                sub85: 0,
                sub86: 0
            },
            {
                sub81: 0,
                sub82: 0,
                sub83: 1,
                sub84: 0,
                sub85: 0,
                sub86: 0
            },
            {
                sub81: 1,
                sub82: 0,
                sub83: 0,
                sub84: 0,
                sub85: 0,
                sub86: 0
            },
            {
                sub81: 0,
                sub82: 0,
                sub83: 0,
                sub84: 0,
                sub85: 0,
                sub86: 1
            },
        ]
    });

    // Par Pattern
    msg.emit("/anime/timeline/new", {
        name: "Pars Pattern",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub56: 0,
                sub57: 0,
                sub59: 0,
                sub60: 1
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub56: 1,
                sub57: 0,
                sub59: 0,
                sub60: 0
            },
            {
                sub56: 0,
                sub57: 0,
                sub59: 1,
                sub60: 0
            },
            {
                sub56: 0,
                sub57: 1,
                sub59: 0,
                sub60: 0
            },
            {
                sub56: 0,
                sub57: 0,
                sub59: 0,
                sub60: 1
            }
        ]
    });

    // Par Pattern @FL
    msg.emit("/anime/timeline/new", {
        name: "Pars Pattern @FL",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub361: 0,
                sub362: 0,
                sub364: 0,
                sub365: 1
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub361: 1,
                sub362: 0,
                sub364: 0,
                sub365: 0
            },
            {
                sub361: 0,
                sub362: 0,
                sub364: 1,
                sub365: 0
            },
            {
                sub361: 0,
                sub362: 1,
                sub364: 0,
                sub365: 0
            },
            {
                sub361: 0,
                sub362: 0,
                sub364: 0,
                sub365: 1
            }
        ]
    });

    // Par Flasher
    msg.emit("/anime/timeline/new", {
        name: "Flasher",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub55: 1
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub55: 0
            }
        ]
    });

    // Par Flasher White
    msg.emit("/anime/timeline/new", {
        name: "White Flasher",
        linkToSubs: true,
        linkEngine: true,
        show: true,
        common: {
            targets: {
                sub54: 1
            },
            easing: 'easeInOutQuint',
            duration: 1,
            loop: true
        },
        objects: [
            {
                sub54: 0
            }
        ]
    });
}