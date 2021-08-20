import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'
import Image from 'next/image'

import { usePlayer } from '../../context/PlayerContext'
import Head from 'next/head'

type Episode ={
    id: string;
    title:string;
    members:string;
    thumbnail: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

type EpisodesProps ={
    episode: Episode
}

export default function Episode({episode}: EpisodesProps){
    const {play} = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title}| Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={()=> play(episode)}>
                    <img src="/play.svg" alt="Tocar episodio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} /> {/*normalmente por segurança o react nao converte 
            o texto para html - essa é forma de converter */}
                
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () =>{
    const {data} = await api.get('episodes', {
        params:{ 
          _limit:2, 
          _sort: 'published_at',
          _order: 'desc'
        }
    })
    
    const paths = data.map(episode =>{
        return{
            params:{
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking', // false retorna erro 404, se não tiver nada nos paths
        // true faz com que a requisição para buscar dados do, ep que esta dentro do getStaticProps
        //aconteça pelo lado do client, pelo lado do browser - passar um router, if 
        // blocking - client(browser) - next.js(node.js) - server(back-end) - rodar as requisições no next.js
    }
}

export const getStaticProps: GetStaticProps = async(ctx) =>{
    const { slug } = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`)

    const episode ={
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description:  data.description,
        url: data.file.url,
      }
    return {
        props:{
            episode
        },
        revalidate: 60 * 60 * 24, // 24 horas

    }
}