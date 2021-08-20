export function convertDurationToTimeString(duration: number){
    const hours = Math.floor(duration / 3600)
    const mintues = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    const timeString = [hours, mintues, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':')

    return timeString;
}