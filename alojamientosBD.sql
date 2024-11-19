--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-11-19 13:58:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 221 (class 1255 OID 49223)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 49307)
-- Name: alojamientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alojamientos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    ubicacion character varying(255) NOT NULL,
    tipo_alojamiento character varying(255) NOT NULL,
    precio numeric(10,2) NOT NULL,
    descripcion_corta text NOT NULL,
    destacado boolean DEFAULT false NOT NULL,
    provincia character varying(255) NOT NULL,
    url_imagen character varying(255) NOT NULL,
    capacidad_huespedes integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.alojamientos OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 49306)
-- Name: alojamientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alojamientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alojamientos_id_seq OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 215
-- Name: alojamientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alojamientos_id_seq OWNED BY public.alojamientos.id;


--
-- TOC entry 220 (class 1259 OID 65699)
-- Name: reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservas (
    id integer NOT NULL,
    alojamiento_id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL
);


ALTER TABLE public.reservas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 65698)
-- Name: reservas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservas_id_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 219
-- Name: reservas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;


--
-- TOC entry 218 (class 1259 OID 57489)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 57488)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4699 (class 2604 OID 49310)
-- Name: alojamientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alojamientos ALTER COLUMN id SET DEFAULT nextval('public.alojamientos_id_seq'::regclass);


--
-- TOC entry 4703 (class 2604 OID 65702)
-- Name: reservas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);


--
-- TOC entry 4702 (class 2604 OID 57492)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4858 (class 0 OID 49307)
-- Dependencies: 216
-- Data for Name: alojamientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alojamientos (id, nombre, ubicacion, tipo_alojamiento, precio, descripcion_corta, destacado, provincia, url_imagen, capacidad_huespedes) FROM stdin;
1	Ocean View Penthouse	Punta Pacífica	Penthouse	325.00	Mejor vista de la ciudad y el mar, lujo contemporáneo	t	Panamá	https://gallery.janelbi.com/2277/P2277-f4036f29690de0319d6eeb2798321b4e.jpg	4
2	Overwater Bungalow	Isla Colón	Bungalow	225.00	Experiencia única sobre el mar Caribe	t	Bocas del Toro	https://solbungalowsbocas.com/wp-content/uploads/2021/04/Sol-Bungalows-Overwater-Bungalow-Photos-For-Web-67.jpg	3
3	Mountain Retreat	Boquete	Retiro de montaña	200.00	Mejor experiencia de montaña y café	t	Chiriquí	https://servmorrealty.com/storage/properties/15892/photos/1ApartmentChiriquiBoqueteAltoBoqueteCondominiosID22206.jpg	3
4	Beach Resort Villa	Playa Blanca	Resort todo incluido	315.00	Mejor resort todo incluido	t	Coclé	https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_427,q_75,w_640/v1/crm/panama/001-PB_D3B38517-310A-4F0E-8952CADC97240DAA_228952b6-0a38-4fd8-ad62bfe24df2b666.jpg	3
5	Vista Coronado Luxury Condo	Coronado	Condo de lujo	225.00	Mejor combinación de lujo y playa	t	Panamá Oeste	https://lbcdn.airpaz.com/hotelimages/3961427/amazing-ocean-view-luxury-condo-in-coronado-panama-26e3e27353fc4a65ac342fdc02d3d897.jpg	3
6	Jungle Adventure Lodge	La Palma	Lodge de aventura	160.00	Experiencia más auténtica y única	t	Darién	https://traveldarienpanama.com/wp-content/uploads/2021/12/DSC07819.jpg	4
7	Beach Villa	Pedasí	Villa de playa	250.00	Mejor spot de surf y playa privada	t	Los Santos	https://imgservice.sun-ski.com/500x245/luxury-ocean-view-villa-pa-pedasi-ha-3214061125-0.jpg	2
8	Casa Casco Antiguo	Casco Viejo	Casa	180.00	Hermosa casa colonial en el corazón de Casco Viejo	f	Panamá	https://casacasco.com/wp-content/uploads/Plaza-321-scaled.jpg	4
9	River Lodge	Volcán	Lodge	190.00	Ubicación idónea para explorar los volcanes y ríos de Chiriquí	f	Chiriquí	https://cabanas-mountain-river-lake-inn-volcan.hotelmix.es/data/Photos/OriginalPhoto/6368/636877/636877788/Cabanas-Mountain-River-Lake-Inn-Volcan-Exterior.JPEG	1
10	Mountain View Lodge	Santa Fe	Lodge	160.00	Vistas panorámicas de las montañas de Santa Fe	f	Veraguas	https://hotel-santa-fe.panamahotel24.com/data/Photos/700x500w/8163/816367/816367796.JPEG	4
11	Punta Chame Kite House	Punta Chame	Casa	220.00	Casa frente al mar ideal para el kite surf	f	Panamá Oeste	https://images.squarespace-cdn.com/content/v1/5d051a5d91854d000127f554/df63f535-023d-4c48-9663-2aff4e5e0272/Kitesurf+Panama+Kite+House.jpg	4
12	Country House	Chitré	Casa de campo	160.00	Casa rural tranquila y acogedora	f	Herrera	https://a0.muscache.com/im/pictures/miso/Hosting-41752364/original/86d125df-fc47-447e-b764-108799229ac5.jpeg	4
\.


--
-- TOC entry 4862 (class 0 OID 65699)
-- Dependencies: 220
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservas (id, alojamiento_id, usuario_id, fecha_inicio, fecha_fin) FROM stdin;
1	1	1	2024-11-19	2024-11-19
\.


--
-- TOC entry 4860 (class 0 OID 57489)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, email, password_hash) FROM stdin;
1	Javier13	ejemplo@email.com	7fnPkHGGEO595TwNzCUHOSOQRN6boRW7DKYCbD5JWKU=
2	123	valdesjavier083@gmail.com	134iEj5k09h/H5XZz/egtq9sMrmoFVLLkOmR61XPY9Q=
3	random	random@gmail.com	WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=
\.


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 215
-- Name: alojamientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alojamientos_id_seq', 12, true);


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 219
-- Name: reservas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservas_id_seq', 1, true);


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);


--
-- TOC entry 4705 (class 2606 OID 49315)
-- Name: alojamientos alojamientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alojamientos
    ADD CONSTRAINT alojamientos_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 65704)
-- Name: reservas reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 57498)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4709 (class 2606 OID 57496)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 65705)
-- Name: reservas reservas_alojamiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_alojamiento_id_fkey FOREIGN KEY (alojamiento_id) REFERENCES public.alojamientos(id);


--
-- TOC entry 4713 (class 2606 OID 65710)
-- Name: reservas reservas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


-- Completed on 2024-11-19 13:58:54

--
-- PostgreSQL database dump complete
--

