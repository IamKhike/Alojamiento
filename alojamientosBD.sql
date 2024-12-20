PGDMP  6    6            
    |            alojamientos_db    16.4    16.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    49209    alojamientos_db    DATABASE     �   CREATE DATABASE alojamientos_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE alojamientos_db;
                postgres    false            �            1255    49223    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
 1   DROP FUNCTION public.update_updated_at_column();
       public          postgres    false            �            1259    49307    alojamientos    TABLE     �  CREATE TABLE public.alojamientos (
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
     DROP TABLE public.alojamientos;
       public         heap    postgres    false            �            1259    49306    alojamientos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.alojamientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.alojamientos_id_seq;
       public          postgres    false    216                       0    0    alojamientos_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.alojamientos_id_seq OWNED BY public.alojamientos.id;
          public          postgres    false    215            �            1259    65699    reservas    TABLE       CREATE TABLE public.reservas (
    id integer NOT NULL,
    alojamiento_id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    numero_huespedes integer DEFAULT 1 NOT NULL,
    precio numeric(10,2) DEFAULT 0.00 NOT NULL
);
    DROP TABLE public.reservas;
       public         heap    postgres    false            �            1259    65698    reservas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.reservas_id_seq;
       public          postgres    false    220                       0    0    reservas_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;
          public          postgres    false    219            �            1259    57489    usuarios    TABLE     �   CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false            �            1259    57488    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public          postgres    false    218            	           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public          postgres    false    217            [           2604    49310    alojamientos id    DEFAULT     r   ALTER TABLE ONLY public.alojamientos ALTER COLUMN id SET DEFAULT nextval('public.alojamientos_id_seq'::regclass);
 >   ALTER TABLE public.alojamientos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            _           2604    65702    reservas id    DEFAULT     j   ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);
 :   ALTER TABLE public.reservas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            ^           2604    57492    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �          0    49307    alojamientos 
   TABLE DATA           �   COPY public.alojamientos (id, nombre, ubicacion, tipo_alojamiento, precio, descripcion_corta, destacado, provincia, url_imagen, capacidad_huespedes) FROM stdin;
    public          postgres    false    216   3"                  0    65699    reservas 
   TABLE DATA           u   COPY public.reservas (id, alojamiento_id, usuario_id, fecha_inicio, fecha_fin, numero_huespedes, precio) FROM stdin;
    public          postgres    false    220   (       �          0    57489    usuarios 
   TABLE DATA           D   COPY public.usuarios (id, nombre, email, password_hash) FROM stdin;
    public          postgres    false    218   H(       
           0    0    alojamientos_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.alojamientos_id_seq', 12, true);
          public          postgres    false    215                       0    0    reservas_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.reservas_id_seq', 45, true);
          public          postgres    false    219                       0    0    usuarios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.usuarios_id_seq', 10, true);
          public          postgres    false    217            c           2606    49315    alojamientos alojamientos_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.alojamientos
    ADD CONSTRAINT alojamientos_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.alojamientos DROP CONSTRAINT alojamientos_pkey;
       public            postgres    false    216            i           2606    65704    reservas reservas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_pkey;
       public            postgres    false    220            e           2606    57498    usuarios usuarios_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_email_key;
       public            postgres    false    218            g           2606    57496    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    218            j           2606    65705 %   reservas reservas_alojamiento_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_alojamiento_id_fkey FOREIGN KEY (alojamiento_id) REFERENCES public.alojamientos(id);
 O   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_alojamiento_id_fkey;
       public          postgres    false    220    216    4707            k           2606    65710 !   reservas reservas_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);
 K   ALTER TABLE ONLY public.reservas DROP CONSTRAINT reservas_usuario_id_fkey;
       public          postgres    false    220    4711    218            �   �  x�}VMsܸ=S��w$~�&���mY�N�K�T= 8$h�I�7{܃��r�?��)�&� �G���^�F���!�W�)��ô7����<L�?������h�g�hl|P�	k�����%�:��^�z~417�$���㯃4��� ���h?M��C��@ki_�G�ު��>e���;�$]��U�ڪ̈́�rڊJ�-��&gt[��q�E��>�}�I��z�P�}r����?��<I�2�e��y�VɁ+���c����5�xVm%�{m88���?k�a;���n뗄��F S:�ڀp)�M�"�b49��9���ۛ�8��X�W�%U��y����PC����ӷYN2±����[��w�h]'M��G��fֈCw��m�ʪo���+0i��x��^(7;����q��.�eӲt��j;�z=M��]�ɬ7f�W�2��c,�VtEt-���3vBj�l��������0����0QS&e����� ���	8''�8ՏZ���t�w�IU�q.�K�C��\v����`�巇��|z��,=Д�>=�!�2J�n��)iMr�]��C��4m�6W7��fEvsu�����V$��!E'�b�N�Bt��:���6Ȼ���<ۗ8�2:�Fa4�zCyIu�'�۪�B�V`�G��W)Ɵ�C2���\	(;��� ���!5.�ۊb&R�];b�y�<�Ct���5��%@�䈰J��y�w�����<c"M{�{����2��Ԍ��5b'�[�G��(=X@�I������a�������*rD}����3���9Z�ߺ���LYz�e��mW�W
�ܕ�)�|�K�)�IN׺��L���mw�G<Zu �#�5.�j���w^�����q_�,��e���M5�zL=}<�쁠aYE)+IBgM���M|����&ZF�����:�(mop1�;��fP�c9x��Z���do�w�e�~7�+�W�Q��C��q�R�In�_z�ʅ{�96��
�yM���_�X���J�SbN��wA���Xc^�;�ô���B�g�~�9l�#�����@���i��'&A%�zNP%&H?O?[�C�0L��j���S7M�Y�8=	Xɭ��^q� a(c�����1�4{m�/��ԁ��<e���-^�0#��ŽZ�6nw�a⼻��%���,��+H'�E-a���o���M��S��*��^�Z0����=�2���d���'H�^iX$5]�Y��ҫ��f��Z�_�^Y����[�,q�f��1��[�pb#�{)��B)Zڔ����Yݕe���ʻ2G�\��i�*'�����X�R��.� ���] ��2tn�����E�MV �����M�uҮ2��u:F���joj��N
$7bE}Z,�k�˒~F��v+Ž���WΤ�����.Y^�Y��6�@�A��IQԒl� 4k�e�^"�q�-����.�y�          *   x�31�4�44�4202�54�Efqs�Xp��qqq �:      �   9  x�e�ɒ�0�5<G��yXtUۈ��( �� F� <����V�r�s�ȗ?!�}4�%( ַ��(�aI�RZWE�%���d,����v6��ۨ�o�����(�$��������y�+}aE�R�\q![)�)\V ���[Xm=M���a���'J!mT����/�En�o���S������a*�7�̣_O'K]��L4R����虿�2� ���oŤ�2��\8�����
�k�y�$A��o�����
����2HYu�gy'c/���� �;z������D��d�4�R��g�Y�M�=�,2tC���3��}=�U�v�u�u��̻d�&ܦ}V��;΁.��G��E�C@�'f(��߽_�k{�X��q1�V���3��Y�I�.��S~ju�Q�A
lV�(��a�U�i��D���j׺:�X�f��+��:);^R�
8�͵ۤ���"�*�4�t�vV���FE�1�}o�,��;�������� S������^���q!�1��4�����(j��j������S1j���Qf��A�`(����     