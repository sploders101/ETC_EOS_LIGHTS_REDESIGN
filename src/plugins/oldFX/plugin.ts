import { Messager } from '../loader';

export default function init(msg: Messager) {
    msg.emit("/fx/click/new", "second", 4);
    msg.emit("/fx/click/new", "third", 4);
    msg.emit("/fx/click/new", "fourth", 4);
    msg.emit("/fx/click/new", "fifth", 4);


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
}